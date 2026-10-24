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

export interface ImportableCourse {
  course_id: number;
  course_name: string;
}

// Desktop CourseDropdown lists every course the user can see; the course being
// imported into is excluded so a course can't copy its own tasks.
export async function listCoursesToImportFrom(
  request: Request,
  currentCourseId: number | string
): Promise<ApiResult<ImportableCourse[]>> {
  const result = await request('/course');
  if (!result.ok) return result;
  const courses: ImportableCourse[] = result.data?.content?.courses?.[0] ?? [];
  return {
    ok: true,
    data: courses.filter((course) => String(course.course_id) !== String(currentCourseId)),
  };
}

export async function importAssessmentTasks(
  request: Request,
  sourceCourseId: number | string,
  destinationCourseId: number | string
): Promise<ApiResult<void>> {
  const result = await request(
    `/assessment_task_copy?source_course_id=${sourceCourseId}&destination_course_id=${destinationCourseId}`,
    { method: 'POST', body: {} }
  );
  if (!result.ok) return result;
  return { ok: true, data: undefined };
}

export interface RubricOption {
  rubric_id: number;
  rubric_name: string;
}

export interface RoleOption {
  role_id: number;
  role_name: string;
}

// Desktop AdminAddAssessmentTask offers only these two roles for "Completed By".
const COMPLETED_BY_ROLE_NAMES = ['TA/Instructor', 'Student'];

export async function listAssessmentTaskOptions(request: Request): Promise<
  ApiResult<{ rubrics: RubricOption[]; roles: RoleOption[] }>
> {
  const [rubricsResult, rolesResult] = await Promise.all([request('/rubric?all=true'), request('/role')]);
  if (!rubricsResult.ok) return rubricsResult;
  if (!rolesResult.ok) return rolesResult;

  const rubrics: RubricOption[] = rubricsResult.data?.content?.rubrics?.[0] ?? [];
  const roles: RoleOption[] = (rolesResult.data?.content?.roles?.[0] ?? []).filter((role: RoleOption) =>
    COMPLETED_BY_ROLE_NAMES.includes(role.role_name)
  );
  return { ok: true, data: { rubrics, roles } };
}

export interface NewAssessmentTaskInput {
  name: string;
  rubricId: number;
  roleId: number;
  dueDate: Date;
  timeZone: string;
  showSuggestions: boolean;
  showRatings: boolean;
  usingTeams: boolean;
  teamPassword: string;
  notes: string;
  numberOfTeams: string;
  maxTeamSize: string;
}

// Mirrors the desktop POST /assessment_task body; team fields are only sent for team assessments.
export async function createAssessmentTask(
  request: Request,
  courseId: number | string,
  input: NewAssessmentTaskInput
): Promise<ApiResult<void>> {
  const result = await request('/assessment_task', {
    method: 'POST',
    body: {
      assessment_task_name: input.name,
      course_id: Number(courseId),
      rubric_id: input.rubricId,
      role_id: input.roleId,
      due_date: input.dueDate.toISOString(),
      time_zone: input.timeZone,
      show_suggestions: input.showSuggestions,
      show_ratings: input.showRatings,
      unit_of_assessment: input.usingTeams,
      create_team_password: input.teamPassword,
      comment: input.notes,
      number_of_teams: input.usingTeams ? Number(input.numberOfTeams) : null,
      max_team_size: input.usingTeams ? Number(input.maxTeamSize) : null,
    },
  });
  if (!result.ok) return result;
  return { ok: true, data: undefined };
}
