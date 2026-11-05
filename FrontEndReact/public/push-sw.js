// Push-notification handling for the service worker. Loaded via Workbox's
// `importScripts` option (see vite.config.ts) alongside the auto-generated
// precache/routing service worker, rather than replacing it -- this file
// only adds two new event listeners, it doesn't touch anything else the
// service worker already does.

self.addEventListener('push', (event) => {
  // The payload is whatever send_push_notification() (BackEndFlask) sent:
  // JSON.stringify({ title, body }). A push with no payload at all is
  // technically allowed by the spec, so this falls back to something
  // generic rather than throwing.
  let title = 'SkillBuilder';
  let body = 'You have a new notification.';

  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title || title;
      body = payload.body || body;
    } catch {
      // Not JSON -- treat the raw text as the body.
      body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // '?view=notifications' is read by AppState.tsx's componentDidMount, which
  // switches straight to the My Notifications page and strips the marker.
  // Query params survive a same-origin navigation but not a postMessage to a
  // tab that hasn't mounted that component yet (e.g. still on the login
  // screen), so an in-place navigate() is used here instead for the
  // already-open case, not just focus() -- same mechanism either way, on
  // both desktop and mobile.
  const targetUrl = '/?view=notifications';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('navigate' in client) {
          return client.navigate(targetUrl).then((navigatedClient) => navigatedClient && navigatedClient.focus());
        }
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
