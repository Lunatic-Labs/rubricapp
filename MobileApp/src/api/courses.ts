import type { ApiResult } from '@/api/client';

// Shape returned by the backend's CourseSchema (/course).
export interface Course {
  course_id: number;
  course_name: string;
  course_number: string;
  term: string;
  year: number;
  active: boolean;
  use_tas: boolean;
  use_fixed_teams: boolean;
  admin_id: number;
}

type Request = (path: string, options?: { method?: string; body?: unknown }) => Promise<ApiResult<any>>;

export async function listCoursesForAdmin(
  request: Request,
  adminUserId: number | string
): Promise<ApiResult<Course[]>> {
  const result = await request(`/course?admin_id=${adminUserId}`);
  if (!result.ok) {
    return result;
  }
  const courses: Course[] = result.data?.content?.courses?.[0] ?? [];
  return { ok: true, data: courses };
}
