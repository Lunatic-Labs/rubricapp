import type { ApiResult } from '@/api/client';

// Shape returned by the backend's AssessmentTaskSchema (/assessment_task).
export interface AssessmentTask {
  assessment_task_id: number;
  assessment_task_name: string;
  due_date: string | null;
  role_id: number;
  rubric_id: number;
  unit_of_assessment: boolean;
}

// Assessment task with role/rubric IDs resolved to display names, matching
// what ViewAssessmentTasks.tsx shows for a super admin (Task Name, Due Date,
// Completed By, Rubric Used, Team?) — the only 5 columns super admins see;
// all other columns there (Publish/Lock/Edit/View/To Do/Notify) are hidden
// for that role on desktop too.
export interface AssessmentTaskView extends AssessmentTask {
  roleName: string;
  rubricName: string;
}

type Request = (path: string, options?: { method?: string; body?: unknown }) => Promise<ApiResult<any>>;

export async function listAssessmentTasksForCourse(
  request: Request,
  courseId: number | string
): Promise<ApiResult<AssessmentTaskView[]>> {
  const [tasksResult, rolesResult, rubricsResult] = await Promise.all([
    request(`/assessment_task?course_id=${courseId}`),
    request('/role'),
    request('/rubric?all=true'),
  ]);

  if (!tasksResult.ok) return tasksResult;
  if (!rolesResult.ok) return rolesResult;
  if (!rubricsResult.ok) return rubricsResult;

  const tasks: AssessmentTask[] = tasksResult.data?.content?.assessment_tasks?.[0] ?? [];
  const roles: { role_id: number; role_name: string }[] = rolesResult.data?.content?.roles?.[0] ?? [];
  const rubrics: { rubric_id: number; rubric_name: string }[] = rubricsResult.data?.content?.rubrics?.[0] ?? [];

  const roleNameById = new Map(roles.map((role) => [role.role_id, role.role_name]));
  const rubricNameById = new Map(rubrics.map((rubric) => [rubric.rubric_id, rubric.rubric_name]));

  const views: AssessmentTaskView[] = tasks.map((task) => ({
    ...task,
    roleName: roleNameById.get(task.role_id) ?? 'N/A',
    rubricName: rubricNameById.get(task.rubric_id) ?? 'N/A',
  }));

  return { ok: true, data: views };
}
