import Cookies from 'universal-cookie';
import { apiUrl } from '../App';
import { refreshAccessTokens } from '../refreshLock';

// Not routed through utility.ts's genericResourceGET/POST/DELETE -- those
// call component.setState() internally and are built for class components,
// which doesn't fit a standalone, reusable piece of logic like this. Same
// reasoning as Login.tsx/Logout.tsx/refreshLock.tsx using a direct fetch();
// this one still needs the Authorization header those raw-fetch call sites
// don't, since (unlike login) it's an authenticated resource.
//
// Still shares utility.ts's refresh-and-retry behavior for an expired access
// token (mirroring handleTokenErrorsAndRetry there), via the same refreshLock
// so a refresh already in flight from elsewhere is reused rather than firing
// a second one. isRetry guards against looping if the retried request fails
// the same way again.
async function authedFetch(path: string, options: RequestInit = {}, isRetry = false): Promise<Response> {
  const cookies = new Cookies();
  const accessToken: string = cookies.get('access_token');
  const user = cookies.get('user');
  const userId = user?.user_id;
  const hasQuery = path.indexOf('?') > -1;
  const url = `${apiUrl}${path}${userId != null ? `${hasQuery ? '&' : '?'}user_id=${userId}` : ''}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      // No-op outside ngrok's free tier; skips its anti-abuse interstitial
      // during real-device testing over a tunnel.
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    },
  });

  if (response.status === 401 && !isRetry) {
    let expired = false;
    try {
      const body = await response.clone().json();
      expired = body?.msg === 'Token has expired';
    } catch {
      // Not JSON; fall through and hand the caller the original response.
    }
    if (expired) {
      const refreshResult = await refreshAccessTokens();
      if (refreshResult !== undefined) {
        return authedFetch(path, options, true);
      }
    }
  }

  return response;
}

// applicationServerKey must be a Uint8Array, but the VAPID public key comes
// from the backend as a base64url string -- this is the standard
// (MDN-documented) conversion between the two.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function getExistingPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribeToPushNotifications(): Promise<void> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  const keyResponse = await authedFetch('/vapid_public_key');
  const keyResult = await keyResponse.json();
  if (!keyResult.success) {
    throw new Error(keyResult.message ?? 'Could not fetch the VAPID public key.');
  }
  const publicKey: string = keyResult.content.vapid_public_key[0].public_key;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    // Cast needed because @types/node's ambient Uint8Array<ArrayBufferLike>
    // override shadows the DOM lib's plain Uint8Array that BufferSource
    // expects -- this is a lib-typing mismatch, not a runtime concern.
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });

  const subscriptionJson = subscription.toJSON();
  // The whole save-and-parse step is inside this try, not just the
  // `!result.success` check below -- a network failure or a non-JSON
  // response (e.g. a 500 HTML error page) would otherwise skip rollback
  // entirely, leaving the browser subscribed with nothing saved server-side.
  try {
    const response = await authedFetch('/push_subscription', {
      method: 'POST',
      body: JSON.stringify({
        endpoint: subscriptionJson.endpoint,
        keys: subscriptionJson.keys,
      }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message ?? 'Could not save the push subscription.');
    }
  } catch (err) {
    // Roll back the browser-side subscription so it doesn't end up
    // subscribed locally with nothing recorded server-side to receive it.
    await subscription.unsubscribe();
    throw err instanceof Error ? err : new Error('Could not save the push subscription.');
  }
}

export async function unsubscribeFromPushNotifications(): Promise<void> {
  const subscription = await getExistingPushSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  await authedFetch('/push_subscription', {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
  });
}
