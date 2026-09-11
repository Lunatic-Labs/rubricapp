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
    return JSON.stringify(extra);
  } catch {
    return String(extra);
  }
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
  if (isDev) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](message, extra ?? '');
  }

  // debug/info are routine, high-volume, and only useful to a developer
  // actively watching the console - no-op them outside dev rather than
  // sending every one to the backend.
  if (level === 'warn' || level === 'error') {
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
