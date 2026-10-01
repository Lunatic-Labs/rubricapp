import type { ApiResult } from '@/api/client';

// GET /admin_notifications is restricted to super admins on the backend
// (@super_admin_check()) — there's no course-scoped equivalent for other roles.
export interface AdminNotification {
  admin_notification_id: number;
  sender_id: number;
  thread_id: number;
  subject: string;
  message: string;
  sent_at: string;
}

type Request = (path: string, options?: { method?: string; body?: unknown }) => Promise<ApiResult<any>>;

export async function listAdminNotifications(
  request: Request,
  isSuperAdmin: boolean
): Promise<ApiResult<AdminNotification[]>> {
  if (!isSuperAdmin) {
    return { ok: false, errorMessage: 'Only super admins can view notifications.', authExpired: false };
  }

  const result = await request('/admin_notifications');
  if (!result.ok) {
    return result;
  }
  const notifications: AdminNotification[] = result.data?.content?.admin_notifications?.[0] ?? [];
  return { ok: true, data: notifications };
}

export async function sendAdminNotification(
  request: Request,
  subject: string,
  message: string
): Promise<ApiResult<void>> {
  const result = await request('/send_admin_notification', {
    method: 'POST',
    body: { subject, message },
  });
  if (!result.ok) {
    return result;
  }
  return { ok: true, data: undefined };
}

export async function deleteAdminNotification(
  request: Request,
  notificationId: number
): Promise<ApiResult<void>> {
  const result = await request('/admin_notifications', {
    method: 'DELETE',
    body: { notification_ids: [notificationId] },
  });
  if (!result.ok) {
    return result;
  }
  return { ok: true, data: undefined };
}
