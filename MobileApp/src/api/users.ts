import type { ApiResult } from '@/api/client';

// Shape returned by the backend's UserSchema (/user, /refresh) — distinct from
// the /login response's user shape (isSuperAdmin/isAdmin/user_name) in @/api/auth.
export interface AdminUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  lms_id: number | null;
  role_id: number;
  is_admin: boolean;
}

type Request = (path: string, options?: { method?: string; body?: unknown }) => Promise<ApiResult<any>>;

export async function listUsers(
  request: Request,
  isSuperAdmin: boolean
): Promise<ApiResult<AdminUser[]>> {
  if (!isSuperAdmin) {
    // Non-super-admins list users scoped to a chosen course (`/user?course_id=...`),
    // which depends on a course-selection screen that doesn't exist yet.
    return { ok: false, errorMessage: 'Select a course to view its users.', authExpired: false };
  }

  const result = await request('/user?isAdmin=True');
  if (!result.ok) {
    return result;
  }
  const users: AdminUser[] = result.data?.content?.users?.[0] ?? [];
  return { ok: true, data: users };
}

export async function deleteUser(request: Request, userId: number): Promise<ApiResult<void>> {
  const result = await request(`/user?uid=${userId}`, { method: 'DELETE' });
  if (!result.ok) {
    return result;
  }
  return { ok: true, data: undefined };
}
