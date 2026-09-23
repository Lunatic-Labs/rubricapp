import { apiUrl } from '@/constants/api';
import { refreshTokens, type Session } from '@/api/auth';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; errorMessage: string; authExpired: boolean };

interface RequestOptions {
  method?: string;
  body?: unknown;
}

// The backend's JWT layer rejects an expired/invalid token before the app's own
// response envelope runs, so failures arrive in two different shapes:
//   { success: false, message: "An error occurred: ..." }  <- the app's own envelope
//   { msg: "Token has expired" }                            <- bare flask-jwt-extended error
const EXPIRED_MESSAGES = ['Token has expired'];
const HARD_FAILURE_MESSAGES = [
  'BlackListed',
  'No Authorization',
  'Not enough segments',
  'Invalid token',
  'Token revoked',
  'Refresh token has been revoked',
  'Missing Authorization Header',
  'Token is not a refresh token',
];

// The app's own error envelope prefixes messages with "An error occurred: ".
function stripPrefix(message: string): string {
  return message.includes(':') ? message.split(':').slice(1).join(':').trim() : message;
}

async function rawRequest(
  path: string,
  session: Session,
  { method = 'GET', body }: RequestOptions
): Promise<{ status: number; json: any }> {
  const separator = path.includes('?') ? '&' : '?';
  const url = `${apiUrl}${path}${separator}user_id=${session.user.user_id}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // Non-JSON response — treated as a generic failure below.
  }

  return { status: res.status, json };
}

/**
 * Makes an authenticated request against the Flask backend's response envelope
 * ({ success, content, message } or, for JWT failures, a bare { msg }), refreshing
 * the access token and retrying once on expiry.
 *
 * On success, returns the raw parsed JSON body under `data` — callers unwrap the
 * `content.<key>[0]` shape themselves, since it varies per endpoint.
 */
export async function apiRequest(
  path: string,
  session: Session,
  options: RequestOptions = {},
  isRetry = false
): Promise<ApiResult<any> & { refreshedSession?: Session }> {
  let status: number;
  let json: any;
  try {
    ({ status, json } = await rawRequest(path, session, options));
  } catch (error) {
    return { ok: false, errorMessage: String(error), authExpired: false };
  }

  if (json?.success) {
    return { ok: true, data: json };
  }

  const bareMsg: string | undefined = json?.msg;
  const appMsg: string | undefined = json?.message;

  if (HARD_FAILURE_MESSAGES.includes(bareMsg ?? '') || HARD_FAILURE_MESSAGES.includes(appMsg ?? '')) {
    return {
      ok: false,
      errorMessage: stripPrefix(appMsg ?? bareMsg ?? 'Session expired. Please log in again.'),
      authExpired: true,
    };
  }

  const isExpired = EXPIRED_MESSAGES.includes(bareMsg ?? '') || status === 422;
  if (isExpired && !isRetry) {
    const refreshedSession = await refreshTokens(session);
    if (!refreshedSession) {
      return { ok: false, errorMessage: 'Session expired. Please log in again.', authExpired: true };
    }
    const retryResult = await apiRequest(path, refreshedSession, options, true);
    return { ...retryResult, refreshedSession };
  }

  return {
    ok: false,
    errorMessage: stripPrefix(appMsg ?? bareMsg ?? 'Server error'),
    authExpired: false,
  };
}
