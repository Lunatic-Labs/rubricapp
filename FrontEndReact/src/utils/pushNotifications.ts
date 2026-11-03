import Cookies from 'universal-cookie';
import { apiUrl } from '../App';

// Not routed through utility.ts's genericResourceGET/POST/DELETE -- those
// call component.setState() internally and are built for class components,
// which doesn't fit a standalone, reusable piece of logic like this. Same
// reasoning as Login.tsx/Logout.tsx/refreshLock.tsx using a direct fetch();
// this one still needs the Authorization header those raw-fetch call sites
// don't, since (unlike login) it's an authenticated resource.
function authedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const cookies = new Cookies();
  const accessToken: string = cookies.get('access_token');
  const user = cookies.get('user');
  const userId = user?.user_id;
  const hasQuery = path.indexOf('?') > -1;
  const url = `${apiUrl}${path}${userId != null ? `${hasQuery ? '&' : '?'}user_id=${userId}` : ''}`;

  return fetch(url, {
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
  const response = await authedFetch('/push_subscription', {
    method: 'POST',
    body: JSON.stringify({
      endpoint: subscriptionJson.endpoint,
      keys: subscriptionJson.keys,
    }),
  });
  const result = await response.json();
  if (!result.success) {
    // Roll back the browser-side subscription so it doesn't end up
    // subscribed locally with nothing recorded server-side to receive it.
    await subscription.unsubscribe();
    throw new Error(result.message ?? 'Could not save the push subscription.');
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
