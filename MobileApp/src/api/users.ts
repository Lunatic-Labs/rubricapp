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

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  lmsId: string | null;
}

// SuperAdmin editing an existing admin user — role_id is always 3 (Admin),
// mirroring AdminAddUser.tsx's SuperAdmin edit path exactly.
export async function updateUser(
  request: Request,
  targetUserId: number | string,
  ownerId: number | string,
  input: UpdateUserInput
): Promise<ApiResult<AdminUser>> {
  const result = await request(`/user?uid=${targetUserId}`, {
    method: 'PUT',
    body: {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      lms_id: input.lmsId,
      consent: null,
      owner_id: ownerId,
      role_id: 3,
    },
  });
  if (!result.ok) {
    return result;
  }
  const user: AdminUser = result.data?.content?.users?.[0];
  return { ok: true, data: user };
}

// SuperAdmin creating a new admin user — role_id is always 3 (Admin),
// mirroring AdminAddUser.tsx's SuperAdmin create path (POST /user, no query params).
export async function createUser(
  request: Request,
  ownerId: number | string,
  input: UpdateUserInput
): Promise<ApiResult<AdminUser>> {
  const result = await request('/user', {
    method: 'POST',
    body: {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      lms_id: input.lmsId,
      consent: null,
      owner_id: ownerId,
      role_id: 3,
    },
  });
  if (!result.ok) {
    return result;
  }
  const user: AdminUser = result.data?.content?.users?.[0];
  return { ok: true, data: user };
}
