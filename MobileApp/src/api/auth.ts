import { apiUrl } from '@/constants/api';
import { deleteItem, getItem, setItem } from '@/api/secure-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export interface User {
  user_id: string;
  user_name: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  has_set_password: boolean;
  [key: string]: any;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface LoginSuccess {
  success: true;
  headers: { access_token: string; refresh_token: string };
  content: { login: [User] };
}

interface LoginFailure {
  success: false;
  message: string;
}

type LoginResponse = LoginSuccess | LoginFailure;

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; errorMessage: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  let result: LoginResponse;
  try {
    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), password }),
    });
    result = await res.json();
  } catch (error) {
    return { ok: false, errorMessage: String(error) };
  }

  if (!result.success) {
    return { ok: false, errorMessage: result.message };
  }

  const session: Session = {
    accessToken: result.headers.access_token,
    refreshToken: result.headers.refresh_token,
    user: result.content.login[0],
  };
  return { ok: true, session };
}

interface RefreshSuccess {
  success: true;
  headers: { access_token: string; refresh_token: string };
}

interface RefreshFailure {
  success?: false;
  msg?: string;
  message?: string;
}

type RefreshResponse = RefreshSuccess | RefreshFailure;

/**
 * Rotates the access token using the stored refresh token. The backend currently
 * echoes the same refresh token back rather than rotating it, and returns a
 * differently-shaped `user` object than /login — so only the tokens are updated
 * here, the session's `user` (from /login's shape) is left untouched.
 */
export async function refreshTokens(session: Session): Promise<Session | null> {
  let result: RefreshResponse;
  try {
    const res = await fetch(
      `${apiUrl}/refresh?user_id=${session.user.user_id}&refresh_token=${session.refreshToken}`,
      { method: 'POST', headers: { Authorization: `Bearer ${session.refreshToken}` } }
    );
    result = await res.json();
  } catch {
    return null;
  }

  if (!result.success) {
    return null;
  }

  return {
    accessToken: result.headers.access_token,
    refreshToken: result.headers.refresh_token,
    user: session.user,
  };
}

export async function saveSession(session: Session): Promise<void> {
  await Promise.all([
    setItem(ACCESS_TOKEN_KEY, session.accessToken),
    setItem(REFRESH_TOKEN_KEY, session.refreshToken),
    setItem(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function getSession(): Promise<Session | null> {
  const [accessToken, refreshToken, userJson] = await Promise.all([
    getItem(ACCESS_TOKEN_KEY),
    getItem(REFRESH_TOKEN_KEY),
    getItem(USER_KEY),
  ]);

  if (!accessToken || !refreshToken || !userJson) {
    return null;
  }
  return { accessToken, refreshToken, user: JSON.parse(userJson) };
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    deleteItem(ACCESS_TOKEN_KEY),
    deleteItem(REFRESH_TOKEN_KEY),
    deleteItem(USER_KEY),
  ]);
}
