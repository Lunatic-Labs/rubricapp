import { apiUrl } from './App';
import Cookies from 'universal-cookie';
import type { User } from './utility';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;

function stringifyExtra(extra: unknown): string {
  if (extra === undefined) return '';
  if (extra instanceof Error) return extra.stack || extra.message;
  if (typeof extra === 'string') return extra;
  try {
    return JSON.stringify(extra) ?? String(extra);
  } catch {
    return String(extra);
  }
}

// How long after a backend request fails its X-Request-ID is still attached
// to reports. Long enough to cover the caller logging the failure (usually
// immediately), short enough that an unrelated later error isn't tagged with it.
const FAILED_REQUEST_WINDOW_MS = 30_000;

let lastFailedRequest: { id: string; at: number } | null = null;

// Called by genericResourceFetch (utility.ts) when the server answers with an
// error, so the next report can name the request whose backend log lines
// explain it. It's "the most recent failure in this tab", not a guaranteed
// cause, which is why the backend logs it as failed_request_id.
export function noteFailedRequest(requestId: string | null): void {
  if (requestId) {
    lastFailedRequest = { id: requestId, at: Date.now() };
  }
}

function recentFailedRequestId(): string | undefined {
  if (lastFailedRequest && Date.now() - lastFailedRequest.at <= FAILED_REQUEST_WINDOW_MS) {
    return lastFailedRequest.id;
  }
  return undefined;
}

// Best-effort report to the backend so warnings/errors that only ever
// happened in one user's browser still show up somewhere. Deliberately a
// plain fetch rather than the genericResourceFetch helpers in utility.ts:
// this must still work when auth is broken, expired, or absent (that's
// often exactly when there's something to report), and it must never
// itself participate in the app's token-refresh/retry machinery.
function reportToServer(level: LogLevel, message: string, extra: unknown): void {
  try {
    let userId = '';
    try {
      const user = new Cookies().get('user') as User | undefined;
      userId = user?.user_id ?? '';
    } catch {
      // Cookie access can throw in locked-down browser contexts; reporting
      // without a user_id is still better than not reporting at all.
    }

    fetch(`${apiUrl}/client-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message,
        extra: stringifyExtra(extra),
        url: window.location.href,
        user_id: userId,
        request_id: recentFailedRequestId(),
      }),
      keepalive: true,
    }).catch(() => {
      // Nothing useful to do if the report itself fails to send.
    });
  } catch {
    // Logging must never throw back into the caller.
  }
}

function log(level: LogLevel, message: string, extra?: unknown): void {
  // debug/info are routine, high-volume, and only useful to a developer
  // actively watching the console - no-op them outside dev rather than
  // printing or sending every one to the backend.
  const isProblem = level === 'warn' || level === 'error';

  // warn/error always reach the console, production included: the backend
  // report below is best-effort (rate-limited, blockable by extensions or
  // network trouble), so the console is the record a user or support person
  // can still see in DevTools when that report never arrives.
  if (isDev || isProblem) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](message, extra ?? '');
  }

  if (isProblem) {
    reportToServer(level, message, extra);
  }
}

export const logger = {
  debug: (message: string, extra?: unknown) => log('debug', message, extra),
  info: (message: string, extra?: unknown) => log('info', message, extra),
  warn: (message: string, extra?: unknown) => log('warn', message, extra),
  error: (message: string, extra?: unknown) => log('error', message, extra),
};

export default logger;
