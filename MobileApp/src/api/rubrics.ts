import type { ApiResult } from '@/api/client';

// Shape returned by the backend's RubricSchema (/rubric).
export interface Rubric {
  rubric_id: number;
  rubric_name: string;
  rubric_description: string;
  category_total: number;
}

// Shape returned by the backend's CategorySchema (/category), trimmed to the
// fields the mobile list shows.
export interface RubricCategory {
  category_id: number;
  category_name: string;
  rubric_id: number;
  default_rubric: string | null;
}

export interface RubricWithCategories extends Rubric {
  categories: RubricCategory[];
}

type Request = (path: string, options?: { method?: string; body?: unknown }) => Promise<ApiResult<any>>;

// Desktop AdminViewCustomRubrics loads the user's custom rubrics and their
// categories separately, then joins them by rubric_id — mirrored here.
export async function listCustomRubrics(request: Request): Promise<ApiResult<RubricWithCategories[]>> {
  const [rubricsResult, categoriesResult] = await Promise.all([
    request('/rubric?custom=true'),
    request('/category?custom=true'),
  ]);

  if (!rubricsResult.ok) return rubricsResult;
  if (!categoriesResult.ok) return categoriesResult;

  const rubrics: Rubric[] = rubricsResult.data?.content?.rubrics?.[0] ?? [];
  const categories: RubricCategory[] = categoriesResult.data?.content?.categories?.[0] ?? [];

  const rubricsWithCategories: RubricWithCategories[] = rubrics.map((rubric) => ({
    ...rubric,
    categories: categories.filter((category) => category.rubric_id === rubric.rubric_id),
  }));

  return { ok: true, data: rubricsWithCategories };
}

export interface RubricPickerData {
  rubrics: Rubric[];
  categories: RubricCategory[];
}

// Desktop AdminAddCustomRubric loads the default rubrics and every category,
// then the builder groups categories under their rubric for selection.
export async function listRubricPickerData(request: Request): Promise<ApiResult<RubricPickerData>> {
  const [rubricsResult, categoriesResult] = await Promise.all([request('/rubric'), request('/category')]);
  if (!rubricsResult.ok) return rubricsResult;
  if (!categoriesResult.ok) return categoriesResult;

  return {
    ok: true,
    data: {
      rubrics: rubricsResult.data?.content?.rubrics?.[0] ?? [],
      categories: categoriesResult.data?.content?.categories?.[0] ?? [],
    },
  };
}

// Mirrors the desktop POST /rubric body: rubric fields plus the chosen category IDs.
export async function createCustomRubric(
  request: Request,
  ownerId: number | string,
  name: string,
  description: string,
  categoryIds: number[]
): Promise<ApiResult<void>> {
  const result = await request('/rubric', {
    method: 'POST',
    body: {
      rubric: {
        rubric_name: name,
        rubric_description: description,
        owner: ownerId,
      },
      categories: categoryIds,
    },
  });
  if (!result.ok) return result;
  return { ok: true, data: undefined };
}

export interface RubricForEdit {
  rubric_name: string;
  rubric_description: string;
  categoryIds: number[];
}

// Desktop AddCustomRubric (edit mode) loads the rubric and its categories by rubric_id.
export async function getRubricForEdit(request: Request, rubricId: number | string): Promise<ApiResult<RubricForEdit>> {
  const [rubricResult, categoriesResult] = await Promise.all([
    request(`/rubric?rubric_id=${rubricId}`),
    request(`/category?rubric_id=${rubricId}`),
  ]);
  if (!rubricResult.ok) return rubricResult;
  if (!categoriesResult.ok) return categoriesResult;

  const rawRubric = rubricResult.data?.content?.rubrics?.[0];
  const rubric = Array.isArray(rawRubric) ? rawRubric[0] : rawRubric;
  const categories: RubricCategory[] = categoriesResult.data?.content?.categories?.[0] ?? [];

  return {
    ok: true,
    data: {
      rubric_name: rubric?.rubric_name ?? '',
      rubric_description: rubric?.rubric_description ?? '',
      categoryIds: categories.map((category) => category.category_id),
    },
  };
}

export async function updateCustomRubric(
  request: Request,
  rubricId: number | string,
  ownerId: number | string,
  name: string,
  description: string,
  categoryIds: number[]
): Promise<ApiResult<void>> {
  const result = await request(`/rubric?rubric_id=${rubricId}`, {
    method: 'PUT',
    body: {
      rubric: {
        rubric_name: name,
        rubric_description: description,
        owner: ownerId,
      },
      categories: categoryIds,
    },
  });
  if (!result.ok) return result;
  return { ok: true, data: undefined };
}

export async function deleteCustomRubric(request: Request, rubricId: number | string): Promise<ApiResult<void>> {
  const result = await request(`/rubric?rubric_id=${rubricId}`, { method: 'DELETE' });
  if (!result.ok) return result;
  return { ok: true, data: undefined };
}
