# TypeScript Type Reference

**Purpose**: Quick reference for developers adding or modifying frontend components.
Shows shared data types, established patterns, and props/state for all components.

Shared type definitions live in [`src/types/`](./types/).

---

## Table of Contents

1. [Key Patterns & Conventions](#1-key-patterns--conventions)
2. [Shared Types — src/types/](#2-shared-types--srctypes)
3. [Utility Functions — utility.ts](#3-utility-functions--utilityts)
4. [Component Reference](#4-component-reference)
5. [File Checklist (Completed)](#5-file-checklist-completed)

---

## 1. Key Patterns & Conventions

### `navbar: any` is intentional
Every component receives `navbar` as `any`. This is a **team lead decision** — do not change it.

### Parse functions require `as any`
`utility.ts` parse functions use their own internal interfaces that differ from `src/types/`.
Always cast when calling them with `src/types` objects:
```tsx
parseUserNames(users as any)
parseCourseRoles(courses as any)
parseRubricNames(rubrics as any)
```

### `noUncheckedIndexedAccess` — use `!` in closures
TypeScript cannot narrow array/Record index access inside callbacks. Use `!`:
```tsx
this.state.items!.filter(...)     // state array that was null-checked above
items[0]!.property                // first element of a known non-empty array
record[key]!                      // Record<K,V> when key is guaranteed to exist
```

### MUI Select `onChange`
```tsx
import { SelectChangeEvent } from '@mui/material/Select';
onChange={(event: SelectChangeEvent<string>) => props.setSomething(event.target.value)}
```

### MUI `disabled` prop from optional boolean
MUI's `disabled` expects `boolean`, not `boolean | undefined`. Use nullish coalescing:
```tsx
disabled={props.disabled ?? false}
```

### `styled` and `Theme` imports
```tsx
import { styled, Theme } from '@mui/material';  // NOT from '@mui/material/styles'
```

### Standard data-fetching state pattern
Most "Admin*" and "Student*" wrapper components follow this state pattern:
```tsx
interface SomeState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    // ...domain data: DomainType[] | null
}
```

### `customBodyRender` callbacks in MUI DataTable columns
Type each callback parameter based on the column's data type:
- `assessment_task_id` → `number`
- `due_date`, `initial_time`, `last_update` → `string`
- `unit_of_assessment` → `boolean`
- `user_id`, `team_id`, `rubric_id` → `number`
- String display values → `string`

---

## 2. Shared Types — src/types/

These are the canonical backend response types. Import them from `src/types/` in all components.

### Primitive Aliases
Defined in [`src/types/StringLabels.tsx`](./types/StringLabels.tsx).

| Type | Definition | Description |
|------|-----------|-------------|
| `ISODateString` | `string` | ISO-8601 formatted date, e.g. `"2025-12-25T13:20:00"` |

---

### AssessmentTask
Defined in [`src/types/AssessmentTask.tsx`](./types/AssessmentTask.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `assessment_task_id` | `number` | Primary key |
| `assessment_task_name` | `string` | Display name |
| `comment` | `string` | Teacher comment |
| `course_id` | `number` | Related course |
| `create_team_password` | `string` | Password to swap teams; empty string if not set |
| `due_date` | `ISODateString` | When the task is due |
| `locked` | `boolean` | Whether the task is editable |
| `max_team_size` | `number \| null` | Max team size; null if not applicable |
| `notification_sent` | `ISODateString \| null` | When notification was sent; null if not sent |
| `number_of_teams` | `number \| null` | Number of teams; null if not applicable |
| `published` | `boolean` | Whether students can see the task |
| `role_id` | `number` | Role that can complete this task |
| `rubric_id` | `number` | Related rubric |
| `show_ratings` | `boolean` | Whether ratings are displayed |
| `show_suggestions` | `boolean` | Whether suggestions are displayed |
| `time_zone` | `string` | Time zone of the task |
| `unit_of_assessment` | `boolean` | `true` = team assessment, `false` = individual |

---

### CompleteAssessmentTask
Defined in [`src/types/CompleteAssessmentTask.tsx`](./types/CompleteAssessmentTask.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `assessment_task_id` | `number` | Related assessment task |
| `assessment_task_name` | `string` | Display name |
| `completed_assessment_id` | `number` | Primary key |
| `completed_by` | `number` | ID of individual/team who last edited |
| `done` | `boolean` | Whether the assessment is finished |
| `initial_time` | `ISODateString` | When the completed assessment was first created |
| `last_update` | `ISODateString` | Most recent update timestamp |
| `locked` | `boolean` | Whether edits are prevented |
| `rating_observable_characteristics_suggestions_data` | `Record<string, { rating: number; observable_characteristics: string; suggestions: string }>` | All OC and SFI data |
| `rubric_id` | `number` | Related rubric |
| `team_id` | `number \| null` | Owning team; null for individual assessments |
| `user_id` | `number \| null` | Owning user; null for team assessments |

---

### User
Defined in [`src/types/User.tsx`](./types/User.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | `number` | Primary key |
| `first_name` | `string` | |
| `last_name` | `string` | |
| `email` | `string` | |
| `team_name` | `string \| null` | Team the user belongs to, if any |

---

### Team
Defined in [`src/types/Team.tsx`](./types/Team.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `team_id` | `number` | Primary key |
| `team_name` | `string` | Display name |

---

### Course
Defined in [`src/types/Course.tsx`](./types/Course.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `course_id` | `number` | Primary key |
| `course_name` | `string` | Display name |

---

### Rubric
Defined in [`src/types/Rubric.tsx`](./types/Rubric.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `rubric_id` | `number` | Primary key |
| `rubric_name` | `string` | Display name |
| `rubric_description` | `string` | |
| `category_json` | `Record<string, { index: number; observable_characteristics: string[]; suggestions: string[] }>` | Category data keyed by category name |

---

### Category
Defined in [`src/types/Category.tsx`](./types/Category.tsx).

| Field | Type | Description |
|-------|------|-------------|
| `category_id` | `number` | Primary key |
| `category_name` | `string` | Display name |
| `rubric_id` | `number` | Related rubric |
| `rubric_name?` | `string` | Optional — included in some responses |
| `default_rubric?` | `string` | Optional |

---

## 3. Utility Functions — utility.ts

### Generic Fetch Functions
All return `Promise<any>`. Pass `this as any` for the component parameter.
`genericResourceGET` automatically sets `state.isLoaded`, `state.errorMessage`, and the resource key.

```tsx
genericResourceGET(url, "resource_key", this as any)
genericResourceGET(url, "resource_key", this as any, { dest: "stateKey" })  // store under different state key
genericResourcePOST(url, this as any, JSON.stringify(body))
genericResourcePUT(url, this as any, JSON.stringify(body))
genericResourceDELETE(url, this as any)
```

### Parse Functions
All take arrays of their respective types and return lookup maps.
> **Note**: Always cast `src/types` objects with `as any` when passing to these functions (see conventions).

| Function | Input | Output |
|----------|-------|--------|
| `parseUserNames(users)` | `User[]` | `Record<string, string>` — `user_id → "First Last"` |
| `parseRoleNames(roles)` | `Role[]` | `Record<string, string>` — `role_id → role_name` |
| `parseRubricNames(rubrics)` | `Rubric[]` | `Record<string, string>` — `rubric_id → rubric_name` |
| `parseCourseRoles(courses)` | `Course[]` | `Record<string, string>` — `course_id → role_id` |
| `parseAssessmentIndividualOrTeam(tasks)` | `AssessmentTask[]` | `Record<string, boolean>` — `task_id → unit_of_assessment` |
| `parseCategoriesByRubrics(rubrics, categories)` | `Rubric[], Category[]` | `Record<string, Category[]>` — `rubric_id → categories[]` |
| `parseCategoryIDToCategories(categories)` | `Category[]` | `Record<string, Category>` — `category_id → category` |
| `parseCategoriesToContained(categories)` | `Category[]` | `Record<number, boolean>` — all values `false` |

### Date & Validation Helpers

| Function | Signature | Description |
|----------|-----------|-------------|
| `getDueDateString` | `(date: Date) => string` | Formats Date to ISO string |
| `getHumanReadableDueDate` | `(dueDate: string \| Date, timeZone?: string) => string` | e.g. "Jan 25 at 3:00pm" |
| `validPassword` | `(password: string) => boolean \| string` | Returns `true` if valid, or an error message string |
| `debounce` | `<T extends Function>(func: T, wait: number) => T` | Standard debounce |

### Session Helpers (View as Student feature)

| Function | Description |
|----------|-------------|
| `saveAdminCredentialsToSession(cookies)` | Saves admin tokens to sessionStorage before switching to student view |
| `restoreAdminCredentialsFromSession()` | Restores admin tokens from sessionStorage |
| `setTestStudentCookies(data: TestStudentCredentials)` | Sets cookies for viewing as a test student |

---

## 4. Component Reference

Organized by folder. Each entry shows **Props** (the external interface) and **State** (internal data) where notable. Fields listed as `any` are intentional — see Section 1.

> **Common state fields** shared by most data-fetching components are not repeated for every entry:
> - `isLoaded: boolean | null` — null = not started, false = loading, true = done
> - `errorMessage: string | null`
> - `navbar: any` in props

---

### Admin / Add

#### AdminAddAssessmentTask
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `validMessage` | `string` |
| `editAssessmentTask` | `boolean` |
| `dueDate` | `Date` |
| `taskName` | `string` |
| `timeZone` | `string` |
| `roleId` | `string` |
| `rubricId` | `string` |
| `password` | `string` |
| `notes` | `string` |
| `numberOfTerms` | `string` |
| `maxTeamSize` | `string` |
| `suggestions` | `boolean` |
| `ratings` | `boolean` |
| `usingTeams` | `boolean` |
| `completedAssessments` | `CompleteAssessmentTask[] \| null` |
| `isHelpOpen` | `boolean` |
| `errors` | `{ taskName: string; timeZone: string; numberOfTeams: string; maxTeamSize: string; roleId: string; rubricId: string; password: string; notes: string; dueDate: string }` |

---

#### AdminImportAssessmentTask
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `validMessage` | `string` |
| `courses` | `Course[] \| null` |
| `selectedCourses` | `string` |
| `errors` | `{ courseToImportTasksFrom: string }` |

---

#### AdminAddCourse
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `validMessage` | `string` |
| `editCourse` | `boolean` |
| `courseID` | `number \| null` |
| `courseName` | `string` |
| `term` | `string` |
| `year` | `string` |
| `active` | `boolean` |
| `useTas` | `boolean` |
| `useFixedTeams` | `boolean` |
| `anchorEl` | `HTMLElement \| null` |
| `errors` | `{ courseName: string; courseNumber: string; term: string; year: string }` |

---

#### CourseDropdown
**Props**:
| Field | Type |
|-------|------|
| `courses` | `Course[] \| null` |
| `selectedCourse` | `string` |
| `id?` | `string` |
| `handleCourseChange` | `(event: SelectChangeEvent<string>) => void` |

---

#### AdminAddUser
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `validMessage` | `string` |
| `editUser` | `boolean` |
| `showDialog` | `boolean` |
| `mode` | `string` |
| `firstName, lastName, email, originalEmail, role, lmsId` | `string` |
| `errors` | `{ firstName: string; lastName: string; email: string; role: string; lmsId: string }` |

---

#### AdminBulkUpload
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `tab` | `string` |
| `errorMessage` | `string \| null` |
| `selectedFile` | `File \| null` |
| `isLoaded` | `boolean` |
| `teamsPics` | `string[]` |
| `teamsMsgs` | `string[]` |
| `currentTeamPic` | `number` |
| `uploadRequestStatus` | `requestState` |

---

#### AdminAddTeam
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `isLoaded` | `boolean \| null` |
| `errorMessage` | `string \| null` |
| `validMessage` | `string` |
| `editTeam` | `boolean` |
| `observerId` | `string` |
| `teamName` | `string` |
| `users` | `User[] \| null` |
| `errors` | `{ teamName: string; observerId: string }` |
| `instructors` | `{ id: number; firstName: string; lastName: string }[]` |

---

#### AdminEditTeamMembers
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `addTeamAction` | `string` |
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `users` | `User[]` |
| `userEdits` | `{ [key: string]: User }` |
| `teamName` | `string \| null` |

---

#### AddCustomRubric
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `rubrics` | `Rubric[]` |
| `categories` | `Category[]` |
| `chosenCategoryJson` | `any` |
| `categoryMap` | `any` |
| `onError?` | `(error: string) => void` |
| `refreshData?` | `() => void` |

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean \| null` |
| `isHelpOpen` | `boolean` |
| `addCustomRubric` | `boolean` |
| `defaultRubrics` | `Rubric[]` |
| `allCategories` | `Category[]` |
| `rubric` | `Rubric \| null` |
| `errors` | `{ rubricName: string; rubricDescription: string; rubricCategories: string }` |
| `pickedCategories` | `Category[]` |
| `rubricId` | `number` |

---

#### AdminAddCustomRubric / AdminEditCustomRubric
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `isLoaded` | `boolean \| null` |
| `errorMessage` | `string \| null` |
| `rubrics` | `Rubric[] \| null` |
| `categories` | `Category[] \| null` |

---

#### CollapsableRubricCategoryTable
**Props**:
| Field | Type |
|-------|------|
| `categories` | `Category[]` |
| `rubrics` | `Rubric[]` |
| `onCategorySelect?` | `(categoryId: number, isSelected: boolean) => void` |
| `readOnly` | `boolean` |
| `showEditButton?` | `boolean` |
| `selectedCategories?` | `Category[]` |
| `navbar?` | `any` |

---

### Admin / View / Complete Assessment Task

The components in this folder form a tree: `CompleteAssessmentTask` → `Form` → `UnitOfAssessmentTab` → `Unit` → `Section` → (`Rating`, `ObservableCharacteristic`, `Suggestion`, `TextArea`, `StatusIndicator`).

#### CompleteAssessmentTask
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `assessmentTaskRubric` | `Rubric[] \| null` |
| `teams` | `Team[] \| null` |
| `userFixedTeam` | `Team[] \| null` |
| `users` | `User[] \| null` |
| `teamsUser` | `{ [key: string]: User[] } \| null` |
| `currentUserRole` | `{ role_name: string } \| null` |
| `completedAssessments` | `CompleteAssessmentTask[] \| null` |
| `currentUserId` | `number \| null` |
| `usingTeams` | `boolean` |
| `usingAdHoc` | `boolean` |
| `checkins` | `CheckinsTracker` |
| `checkinEventSource` | `EventSource \| null` |
| `unitList` | `any[] \| null` |
| `jumpId` | `number \| null` |

---

#### Form
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `usingTeams` | `boolean` |
| `units` | `ATUnit[]` |
| `assessmentTaskRubric` | `Rubric` |
| `roleName` | `string` |
| `jumpId` | `number \| null` |
| `checkins` | `CheckinsTracker` |

**State**:
| Field | Type |
|-------|------|
| `currentUnitTabIndex` | `number` |
| `categoryList` | `JSX.Element[] \| null` |
| `currentCategoryTabIndex` | `number` |
| `section` | `JSX.Element \| null` |
| `displaySavedNotification` | `boolean` |
| `hideUnits` | `boolean` |
| `consistentValidUnit` | `number \| null` |
| `unitsThatNeedSaving` | `Set<number>` |

---

#### UnitOfAssessmentTab
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `units` | `ATUnit[]` |
| `checkins` | `CheckinsTracker` |
| `currentUnitTabIndex` | `number` |
| `handleUnitTabChange` | `(index: number) => void` |
| `hideUnits` | `boolean` |
| `usingTeams` | `boolean` |

---

#### Section
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `category` | `string` |
| `currentRocsData` | `Record<string, { rating_json: Record<string, string>; observable_characteristics: string[]; suggestions: string[]; rating: number; comments: string; description: string }>` |
| `assessmentTaskRubric` | `Rubric` |
| `isDone` | `boolean` |
| `currentTabIndex` | `number` |
| `handleUnitTabChange` | `(index: number) => void` |
| `modifyUnitCategoryProperty` | `(unitIndex: number, categoryName: string, propertyName: string, propertyValue: unknown) => void` |
| `markForAutosave` | `(unitIndex: number) => void` |
| `autoSave` | `() => void` |
| `setCategoryProperty` | `(propertyName: string, propertyValue: unknown) => void` |

---

#### Rating
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `currentRating` | `number` |
| `sliderValues` | `{ label: string }[]` |
| `setRating` | `(rating: number) => void` |
| `autoSave` | `() => void` |

---

#### ObservableCharacteristic
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `id` | `number` |
| `observableCharacteristics` | `string[]` |
| `observableCharacteristic` | `string` |
| `setObservableCharacteristics` | `(newData: string) => void` |
| `autoSave` | `() => void` |
| `checked` | `boolean` |

---

#### Suggestion
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `id` | `number` |
| `suggestions` | `string[]` |
| `suggestion` | `string` |
| `setSuggestions` | `(newData: string) => void` |
| `autoSave` | `() => void` |
| `checked` | `boolean` |

---

#### TextArea
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `setComments` | `(value: string) => void` |
| `currentValue` | `string` |
| `autoSave` | `() => void` |

---

#### StatusIndicator
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `status` | `string` |

---

#### cat_utils.ts — Helper Types

| Type | Definition |
|------|-----------|
| `unit` | `{ rocsData: { [key: string]: { observable_characteristics: string[]; suggestions: string[] } } }` |
| `checkins` | `{ user_id?: number; [key: string]: unknown }[]` |

---

### Admin / View / Reporting

#### AdminExportGraphComparison
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `graphItems` | `GraphItem[]` |
| `selectedGraphIds` | `Set<string>` |
| `filterPanelOpen` | `boolean` |
| `filters` | `FilterState` |
| `activeFilters` | `ActiveFilter[]` |
| `categories` | `Category[]` |
| `rubrics` | `Rubric[]` |
| `teams` | `Team[]` |
| `students` | `User[]` |
| `toastOpen` | `boolean` |
| `toastMessage` | `string` |
| `toastSeverity` | `'success' \| 'info' \| 'warning' \| 'error'` |
| `exporting` | `boolean` |

**GraphItem** (local interface):
| Field | Type |
|-------|------|
| `id` | `string` |
| `assessment_task_id` | `number` |
| `assessment_task_name` | `string` |
| `graph_type` | `'distribution' \| 'characteristics' \| 'improvements'` |
| `category_id` | `number \| null` |
| `category_name` | `string` |
| `rubric_id` | `number` |
| `rubric_name` | `string` |
| `team_id` | `number \| null` |
| `team_name` | `string \| null` |
| `student_id` | `number \| null` |
| `student_name` | `string \| null` |
| `due_date` | `string` |
| `total_assessments` | `number` |
| `graph_data` | `unknown` |

---

#### ComparisonDrawer
**Props**:
| Field | Type |
|-------|------|
| `selectedGraphItems` | `GraphItem[]` |
| `onClearSelection` | `() => void` |
| `onRemoveGraph` | `(graphId: string) => void` |

---

#### FilterPanel
**Props**:
| Field | Type |
|-------|------|
| `filters` | `FilterState` |
| `assessmentTasks` | `AssessmentTask[]` |
| `rubrics` | `Rubric[]` |
| `teams` | `Team[]` |
| `students` | `User[]` |
| `onFilterChange` | `(key: keyof FilterState, value: string \| string[]) => void` |
| `onApplyFilters` | `() => void` |
| `onClearFilters` | `() => void` |

---

#### AdminViewAssessmentStatus
**Props**: `navbar: any`, `assessmentTasks: AssessmentTask[]`

**State**:
| Field | Type |
|-------|------|
| `chosenAssessmentId` | `string \| number` |
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean \| null` |
| `completedAssessments` | `CompleteAssessmentTask[] \| null` |
| `loadedAssessmentId` | `string \| number` |
| `categories` | `Category[] \| null` |
| `rubrics` | `Rubric[] \| null` |
| `showRatings` | `boolean` |
| `showSuggestions` | `boolean` |
| `completedByTAs` | `boolean` |
| `courseTotalStudents` | `number \| null` |
| `csvCreation` | `{ csv_data: string } \| null` |
| `downloadedAssessment` | `string \| null` |
| `chosenCategoryId` | `string` |

---

#### ViewAssessmentStatus
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `completedAssessments` | `CompleteAssessmentTask[] \| null` |
| `rubrics` | `Rubric` |
| `assessmentTasks` | `AssessmentTask[]` |
| `chosenAssessmentId` | `string \| number` |
| `setChosenAssessmentId` | `(id: string \| number) => void` |
| `showRatings` | `boolean` |
| `showSuggestions` | `boolean` |
| `completedByTAs` | `boolean` |
| `courseTotalStudents` | `number \| null` |
| `onExportAggregates?` | `(categoryId: string) => void` |

---

#### CharacteristicsAndImprovements
**Props**:
| Field | Type |
|-------|------|
| `characteristicsData` | `{ characteristics: ChartDataItem[] }` |
| `improvementsData` | `{ improvements: ChartDataItem[] }` |
| `showSuggestion` | `boolean` |
| `dataType` | `'characteristics' \| 'improvement'` |

**ChartDataItem** (local):
| Field | Type |
|-------|------|
| `characteristics?` | `string` |
| `improvement?` | `string` |
| `number` | `number` |
| `percentage` | `number` |
| `active?` | `boolean` |

---

#### ViewTAEval
**Props**:
| Field | Type |
|-------|------|
| `children` | `React.ReactNode` |
| `containerEl` | `HTMLDivElement` |
| `externalWindow` | `Window \| null` |

---

#### AdminViewRatings
**Props**: `navbar: any`, `assessmentTasks: AssessmentTask[]`

**State**:
| Field | Type |
|-------|------|
| `chosenAssessmentId` | `string \| number` |
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean \| null` |
| `loadedAssessmentId` | `string \| number` |
| `ratings` | `unknown[] \| null` |
| `categories` | `Category[] \| null` |
| `csvCreation` | `{ csv_data: string } \| null` |
| `exportButtonId` | `Record<string, string>` |
| `downloadedAssessment` | `string \| null` |
| `lastSeenCsvType` | `number \| null` |

---

#### AdminViewTeamRatings
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `assessmentTasks` | `AssessmentTask[] \| null` |

---

#### ViewRatingsHeader
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `assessmentTasks` | `AssessmentTask[]` |
| `chosenAssessmentId` | `string \| number` |
| `setChosenAssessmentId` | `(id: string \| number) => void` |
| `csvCreation` | `{ csv_data: string } \| null` |
| `userData` | `unknown` |

---

#### ViewRatingsTable
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `assessmentTasks` | `AssessmentTask[]` |
| `chosenAssessmentId` | `string \| number` |
| `ratings` | `unknown[]` |
| `categories` | `Category[]` |

---

#### ViewTeamRatings
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `ratings` | `unknown[]` |
| `allRatings` | `Record<string, unknown>[]` |

---

#### AdminReportTabs
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `assessmentTasks` | `AssessmentTask[]` |
| `defaultAssessmentTaskId` | `string \| number` |

---

#### ReportingDashboard
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `assessmentTasks` | `AssessmentTask[] \| null` |

---

#### ReportTabs
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `activeTab` | `string` |
| `setTab` | `(tab: string) => void` |

---

### Admin / View / Other

#### AdminViewAssessmentTask
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `show?` | `string` |
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `assessmentTasks` | `AssessmentTask[] \| null` |
| `roles` | `{ role_id: string; role_name: string }[] \| null` |
| `rubrics` | `Rubric[] \| null` |
| `teams?` | `Team[] \| null` |
| `isViewAsStudent` | `boolean` |

---

#### ViewAssessmentTasks (Admin)
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `teams?` | `Team[] \| null` |
| `isViewingAsStudent?` | `boolean` |

**State**:
| Field | Type |
|-------|------|
| `isLoaded` | `boolean \| null` |
| `errorMessage` | `string \| null` |
| `csvCreation` | `{ csv_data: string } \| null` |
| `downloadedAssessment` | `string \| null` |
| `exportButtonId` | `Record<string, string>` |
| `completedAssessments` | `{ assessment_task_id: number; completed_count: number }[] \| null` |
| `assessmentTasks` | `AssessmentTask[] \| null` |
| `lockStatus` | `Record<number, boolean>` |
| `publishedStatus` | `Record<number, boolean>` |

---

#### AdminViewCompleteAssessmentTasks
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `completedAssessments` | `CompleteAssessmentTask[] \| null` |
| `roles` | `{ role_id: string; role_name: string }[] \| null` |
| `users` | `User[] \| null` |

---

#### ViewCompleteIndividualAssessmentTasks
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `completedAssessment` | `CompleteAssessmentTask[]` |

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean \| null` |
| `showDialog` | `boolean` |
| `notes` | `string` |
| `notificationSent` | `Date \| false` |
| `isSingleMsg` | `boolean` |
| `compATId` | `number \| null` |
| `lockStatus` | `Record<number, boolean>` |
| `errors` | `{ notes: string }` |

---

#### ViewCompleteTeamAssessmentTasks
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `completedAssessment` | `CompleteAssessmentTask[]` |

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean \| null` |
| `showDialog` | `boolean` |
| `notes` | `string` |
| `notificationSent` | `Date \| false` |
| `isSingleMsg` | `boolean` |
| `compATId` | `number \| null` |
| `errors` | `{ notes: string; [key: string]: string }` |

---

#### AdminViewConsent
**Props**: `navbar: any` — **State**: standard + `users: User[] | null`

#### AdminViewCourses
**Props**: `navbar: any` — **State**: standard + `courses: Course[] | null`

#### ViewCourses
**Props**: `navbar: any` — **State**: `courseName: string`, `value: boolean | null`

#### AdminViewCustomRubrics
**Props**: `navbar: any` — **State**: standard + `rubrics: Rubric[] | null`, `categories: Category[] | null`

#### AssessmentDashboard, TeamDashboard
**Props**: `navbar: any` only.

---

#### Notifications
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean \| null` |
| `showDialog` | `boolean` |
| `emailSubject` | `string` |
| `emailMessage` | `string` |
| `notificationSent` | `boolean` |
| `errors` | `{ emailSubject: string; emailMessage: string }` |

---

#### RosterDashboard
**Props**: `navbar: any` — **State**: `isSwitchingToStudent: boolean`

---

#### AdminViewTeamMembers
**Props**: `navbar: any` — **State**: standard + `users: User[]`

#### ViewTeamMembers
**Props**: `navbar: any` only.

---

#### AdminViewTeams
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `teams` | `Team[] \| null` |
| `users` | `User[] \| null` |
| `prevTeamsLength` | `number` |
| `successMessage` | `string \| null` |

---

#### ViewTeams (Admin)
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `teams` | `Team[] \| null` |
| `users` | `Record<string, string>` |
| `onError` | `(message: string) => void` |
| `onSuccess` | `(message: string) => void` |
| `refreshData` | `() => void` |

---

#### AdminViewUsers
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `errorMessage` | `string \| null` |
| `isLoaded` | `boolean` |
| `users` | `User[] \| null` |
| `roles` | `{ role_id: string; role_name: string }[] \| null` |
| `prevUsersLength` | `number` |
| `successMessage` | `string \| null` |

---

#### ViewUsers
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `onError` | `(message: string) => void` |
| `onSuccess` | `(message: string) => void` |
| `refreshData` | `() => void` |

---

### Shared Components

#### AssessmentTaskDropdown
**Props**:
| Field | Type |
|-------|------|
| `assessmentTasks` | `AssessmentTask[]` |
| `chosenAssessmentId` | `string \| number` |
| `setChosenAssessmentId` | `(id: string \| number) => void` |

---

#### BackButton
**Props**: `navbar: any`
> Uses `styled(Button)(({ theme }: { theme: Theme }) => ...)` — import `styled` and `Theme` from `@mui/material`.

#### BackButtonResource
**Props**: `navbar: any`, `tabSelected: string`

---

#### CategoryDropdown
**Props**:
| Field | Type |
|-------|------|
| `categories` | `string[]` |
| `chosenCategoryId` | `string` |
| `setChosenCategoryId` | `(id: string) => void` |
| `disabled?` | `boolean` |

> `categories` is `string[]`, not `Category[]` — items are used as primitive values.

---

#### CourseInfo
**Props**:
| Field | Type |
|-------|------|
| `courseTitle?` | `string` |
| `courseNumber?` | `string \| number` |
| `courseTerm?` | `string` |
| `courseYear?` | `string \| number` |

---

#### CustomDataTable
**Props**:
| Field | Type |
|-------|------|
| `data` | `object[]` |
| `columns` | `any[]` |
| `options?` | `Record<string, unknown>` |

> Uses `import MUIDataTable from 'mui-datatables'` (default import only — named exports not available in installed version).

---

#### DeleteConfirmation
**Props**: `userFirstName: string`, `userLastName: string`, `show: boolean`, `handleDialog: () => void`, `deleteUser: () => void`

#### DropConfirmation
**Props**: `userFirstName: string`, `userLastName: string`, `show: boolean`, `handleDialog: () => void`, `dropUser: () => void`

#### InfoChip, MainHeader
**Props**: `navbar: any` only.

---

#### ReportingHeader
**Props**: `navbar: any`, `setTab: (tab: string) => void`, `activeTab: string`

---

#### SendMessageModal
**Props**:
| Field | Type |
|-------|------|
| `show` | `boolean` |
| `emailSubject` | `string` |
| `emailMessage` | `string` |
| `error` | `{ emailSubject: string; emailMessage: string }` |
| `handleChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` |
| `handleDialog` | `() => void` |
| `sendNotifications` | `() => void` |

---

#### SendNotification
**Props**:
| Field | Type |
|-------|------|
| `show` | `boolean` |
| `notes` | `string` |
| `error` | `{ notes: string }` |
| `handleChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` |
| `handleDialog` | `() => void` |
| `sendNotifications` | `() => void` |

---

#### StudentNavigation
**Props**: `navbar: any`, `tabSelected: string`

---

### Error / Login

#### ErrorMessage
**Props**: `errorMessage: any`
> `errorMessage` stays `any` — it handles `string`, `Error`, and `Record<string, unknown>` at runtime.

#### Login
**State**:
| Field | Type |
|-------|------|
| `isLoaded` | `boolean \| null` |
| `errorMessage` | `string \| null` |
| `loggedIn` | `boolean \| null` |
| `hasSetPassword` | `boolean \| null` |
| `resettingPassword` | `boolean \| null` |
| `isRefreshing` | `boolean` |
| `email` | `string` |
| `password` | `string` |
| `showPassword` | `boolean` |
| `errors` | `{ email: string; password: string }` |
| `cookies!` | `Cookies` (definite assignment — set in componentDidMount) |

---

#### SetNewPassword
**State**:
| Field | Type |
|-------|------|
| `email` | `string` |
| `errorMessage` | `string \| null` |
| `isPasswordSet` | `boolean` |
| `password` | `string` |
| `confirmationPassword` | `string` |
| `showPassword` | `boolean` |
| `errors` | `{ password: string; confirmationPassword: string }` |

---

#### ValidateReset
**State**: `activeTab: string`, `errorMessage: string | null`, `email: string`, `code: string`

---

### Navbar

#### AppState
The central state manager for the whole app. `navbar` in all components refers to an `AppState` instance.

**Key state types** (AppState uses local aliases — `AssessmentTaskType`, `CourseType`, etc. — which mirror but are separate from `src/types`):

| Field | Type |
|-------|------|
| `activeTab` | `string` |
| `user` | `UserType \| null` |
| `course` | `CourseType \| null` |
| `chosenCourse` | `CourseType \| null` |
| `assessmentTask` | `AssessmentTaskType \| null` |
| `chosenAssessmentTask` | `AssessmentTaskType \| null` |
| `chosenCompleteAssessmentTask` | `CompleteAssessmentTaskType \| null` |
| `team` | `TeamType \| null` |
| `teams` | `TeamType[] \| null` |
| `users` | `UserType[] \| null` |
| `successMessage` | `string \| null` |
| `addCustomRubric` | `boolean \| null` |
| `jumpToSection` | `string \| null` |

**Key navigation methods** (called as `this.props.navbar.methodName(...)`):

| Method | Signature |
|--------|-----------|
| `setNewTab` | `(newTab: string) => void` |
| `setSuccessMessage` | `(message: string \| null) => void` |
| `setAssessmentTaskInstructions` | `(assessmentTasks, atId, completedAssessments?, options?) => void` |
| `setSelectCurrentTeam` | `(assessmentTasks, assessmentTaskId) => void` |
| `setStudentDashboardWithCourse` | `(courseId, courses) => void` |
| `setViewCompleteAssessmentTaskTabWithAssessmentTask` | `(completedATs, completedATId, chosenAT, jumpId?) => void` |
| `setAddAssessmentTaskTabWithAssessmentTask` | `(assessmentTasks, atId, course, roleNames, rubricNames) => void` |
| `setAddTeamTabWithTeam` | `(teams, teamId, users, tab, addTeamAction) => void` |
| `setAddUserTabWithUser` | `(users, userId) => void` |
| `setConfirmCurrentTeam` | `(assessmentTasks, atId, switchTeam) => void` |
| `Reset` | `(listOfElements: string[]) => void` |

---

#### BasicTabs
**Props**: `navbar: any`

#### Navbar
**Props**: `userName?: string`, `setNewTab: (tab: string) => void`, `logout: () => void`

#### UserAccount
**Props**: `navbar?: any`

**State**:
| Field | Type |
|-------|------|
| `user_name` | `string` |
| `email` | `string` |
| `errorMessage` | `string \| null` |
| `isPasswordSet` | `boolean` |
| `password` | `string` |
| `confirmationPassword` | `string` |
| `showPassword` | `boolean` |
| `user` | `CookieUser \| null` |
| `resetPasswordDialogOpen` | `boolean` |
| `errors` | `{ password: string; confirmationPassword: string }` |

---

### Student

#### StudentDashboard
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `roles` | `{ role_id: number; role_name: string } \| null` |
| `assessmentTasks` | `AssessmentTask[] \| null` |
| `completedAssessments` | `CompleteAssessmentTask[] \| null` |
| `averageData` | `any` |
| `filteredATs` | `AssessmentTask[] \| null` |
| `filteredCATs` | `CompleteAssessmentTask[] \| null` |
| `isSwitchingBack` | `boolean` |
| `userTeamIds` | `number[]` |
| `fullyDoneCATS` | `CompleteAssessmentTask[] \| null` |
| `rubrics` | `Rubric[] \| null` |
| `rubricNames` | `Record<string, string> \| null` |
| `chartData` | `any` |
| `teamsFetched` | `boolean` |

---

#### StudentViewAssessmentTask
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `role` | `{ role_id: number; role_name: string }` |
| `filteredAssessments` | `AssessmentTask[]` |
| `CompleteAssessments` | `CompleteAssessmentTask[]` |
| `userTeamIds` | `number[]` |

---

#### StudentViewAssessmentTaskInstructions
**Props**: `navbar: any`

**State**: standard + `rubrics: Rubric | null`

---

#### ViewAssessmentTaskInstructions
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `rubrics` | `Rubric` |
| `categories` | `Rubric["category_json"]` |
| `instructions` | `string` |
| `skipInstructions` | `boolean` |
| `errorMessage` | `string \| null` |

---

#### ViewAssessmentTasks (Student)
**Props**:
| Field | Type |
|-------|------|
| `navbar` | `any` |
| `role` | `{ role_id: number; role_name?: string }` |
| `assessmentTasks` | `AssessmentTask[]` |
| `completeAssessments` | `CompleteAssessmentTask[]` |
| `checkin` | `number[]` |
| `rubricNames` | `Record<number, string>` |
| `counts` | `number[]` |
| `userTeamIds` | `number[]` |

---

#### StudentCompletedAssessmentTasks
**Props**: `navbar: any`, `assessmentTasks: AssessmentTask[]`, `filteredCompleteAssessments: CompleteAssessmentTask[]`

#### ViewCompletedAssessmentTasks
**Props**: `navbar: any`, `assessmentTasks: AssessmentTask[]`, `completedAssessments: CompleteAssessmentTask[]`

---

#### BuildTeam (StudentBuildTeam wrapper + BuildTeamTable)
**Props**: `navbar: any`, `users: User[]`

**State**: `selected: { [key: string]: boolean }`, `unselected: { [key: string]: boolean }`

#### ShowTeamMembers
**Props**: `navbar: any` — **State**: standard + `users: User[] | null`, `selectedTeam: string | number | null`

#### StudentBuildTeam
**Props**: `navbar: any` — **State**: standard + `users: User[] | null`

---

#### ConfirmCurrentTeam
**Props**: `students: User[]`, `teamId: string | number`, `teamName: string`, `navbar: any`

#### StudentConfirmCurrentTeam
**Props**: `navbar: any`

**State**: standard + `teamMembers: { users: User[]; team_id: number; team_name: string; } | null`

---

#### SelectTeam
**Props**: `navbar: any`

**State**:
| Field | Type |
|-------|------|
| `teams` | `Team[] \| null` |
| `teamID` | `string` |
| `error` | `boolean` |
| `errorMessage` | `string` |
| `checkInUser` | `() => void` |
| `handleSelect` | `(event: SelectChangeEvent<string>) => void` |

---

#### CodeRequirement
**Props**: `navbar: any`

**State**: `password: string`, `errorMessage: string | null`, `assessmentTasks: AssessmentTask | null`, `validationError: string | null`

---

#### StudentTeamMembers
**Props**: `navbar: any` — **State**: standard + `users: User[] | null`

#### TeamMembers
**Props**: `navbar: any` only. Reads users from `navbar.studentTeamMembers.users`.

---

#### StudentViewTeams
**Props**: `navbar: any`, `updateUserTeamsIds: (teamIds: number[]) => void`

**State**: standard + `teams: Team[] | null`, `users: User[] | null`

---

#### TAViewTeams
**Props**: `navbar: any`

**State**: `errorMessage: string | null`, `isLoaded: boolean`, `user_id: number | null`, `team_members?: any`

> `team_members` stays `any` — complex nested structure from `/team_members` endpoint.

---

#### ViewTeams (Student)
**Props**: `teams: any[]`, `users: { [key: string]: string }`, `navbar: any`

> `teams: any[]` — this version uses a student-specific shape (`team_users`, `observer_id`, `date_created`) that differs from the admin `Team` type.

---

#### ViewTeamsTA
**Props**:
| Field | Type |
|-------|------|
| `navbar?` | `any` |
| `teams?` | `TATeam[]` |
| `users?` | `Record<string, string>` |

**TATeam** (local): `{ teamName: string; studentNames: string }`

---

#### Student / Components / CustomButton
**Props**:
| Field | Type |
|-------|------|
| `label` | `string` |
| `onClick?` | `() => void` |
| `style?` | `React.CSSProperties` |
| `isOutlined?` | `boolean` |
| `position?` | `any` (callers pass objects like `{ top: '10px', right: '0px' }`) |
| `disabled?` | `boolean` |
| `'aria-label'?` | `string` |

---

## 5. File Checklist (Completed)

All 106 files have been processed. All `any` types have been resolved or intentionally retained (see Section 1).

### Admin — Add
- [x] `src/View/Admin/Add/AddCourse/AdminAddCourse.tsx`
- [x] `src/View/Admin/Add/AddCustomRubric/AddCustomRubric.tsx`
- [x] `src/View/Admin/Add/AddCustomRubric/AdminAddCustomRubric.tsx`
- [x] `src/View/Admin/Add/AddCustomRubric/AdminEditCustomRubric.tsx`
- [x] `src/View/Admin/Add/AddCustomRubric/CollapsableRubricCategoryTable.tsx`
- [x] `src/View/Admin/Add/AddCustomRubric/Components/CustomButton.tsx`
- [x] `src/View/Admin/Add/AddTask/AdminAddAssessmentTask.tsx`
- [x] `src/View/Admin/Add/AddTeam/AdminAddTeam.tsx`
- [x] `src/View/Admin/Add/AddTeam/AdminEditTeamMembers.tsx`
- [x] `src/View/Admin/Add/AddUsers/AdminAddUser.tsx`
- [x] `src/View/Admin/Add/AddUsers/AdminBulkUpload.tsx`
- [x] `src/View/Admin/Add/ImportTasks/AdminImportAssessmentTasks.tsx`
- [x] `src/View/Admin/Add/ImportTasks/CourseDropdown.tsx`

### Admin — View — Complete Assessment Task
- [x] `src/View/Admin/View/CompleteAssessmentTask/Category.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/CompleteAssessmentTask.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/Form.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/ObservableCharacteristic.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/Rating.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/Section.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/StatusIndicator.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/Suggestion.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/TextArea.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/UnitOfAssessmentTab.tsx`
- [x] `src/View/Admin/View/CompleteAssessmentTask/cat_utils.ts`
- [x] `src/View/Admin/View/CompleteAssessmentTask/unit.tsx`

### Admin — View — Reporting — ExportGraphComparison
- [x] `src/View/Admin/View/Reporting/ExportGraphComparison/AdminExportGraphComparison.tsx`
- [x] `src/View/Admin/View/Reporting/ExportGraphComparison/ComparisonDrawer.tsx`
- [x] `src/View/Admin/View/Reporting/ExportGraphComparison/FilterPanel.tsx`
- [x] `src/View/Admin/View/Reporting/ExportGraphComparison/GraphCard.tsx`
- [x] `src/View/Admin/View/Reporting/ExportGraphComparison/graphConstants.ts`

### Admin — View — Reporting
- [x] `src/View/Admin/View/Reporting/AdminReportTabs.tsx`
- [x] `src/View/Admin/View/Reporting/ReportTabs.tsx`
- [x] `src/View/Admin/View/Reporting/ReportingDashboard.tsx`
- [x] `src/View/Admin/View/Reporting/ViewAssessmentStatus/AdminViewAssessmentStatus.tsx`
- [x] `src/View/Admin/View/Reporting/ViewAssessmentStatus/CharacteristicsAndImprovements.tsx`
- [x] `src/View/Admin/View/Reporting/ViewAssessmentStatus/ViewAssessmentStatus.tsx`
- [x] `src/View/Admin/View/Reporting/ViewAssessmentStatus/ViewTAEval.tsx`
- [x] `src/View/Admin/View/Reporting/ViewRatings/AdminViewRatings.tsx`
- [x] `src/View/Admin/View/Reporting/ViewRatings/AdminViewTeamRatings.tsx`
- [x] `src/View/Admin/View/Reporting/ViewRatings/ViewRatingsHeader.tsx`
- [x] `src/View/Admin/View/Reporting/ViewRatings/ViewRatingsTable.tsx`
- [x] `src/View/Admin/View/Reporting/ViewRatings/ViewTeamRatings.tsx`

### Admin — View — Other
- [x] `src/View/Admin/View/ViewAssessmentTask/AdminViewAssessmentTask.tsx`
- [x] `src/View/Admin/View/ViewAssessmentTask/ViewAssessmentTasks.tsx`
- [x] `src/View/Admin/View/ViewCompleteAssessmentTasks/AdminViewCompleteAssessmentTasks.tsx`
- [x] `src/View/Admin/View/ViewCompleteAssessmentTasks/ViewCompleteIndividualAssessmentTasks.tsx`
- [x] `src/View/Admin/View/ViewCompleteAssessmentTasks/ViewCompleteTeamAssessmentTasks.tsx`
- [x] `src/View/Admin/View/ViewConsent/AdminViewConsent.tsx`
- [x] `src/View/Admin/View/ViewCourses/AdminViewCourses.tsx`
- [x] `src/View/Admin/View/ViewCourses/ViewCourses.tsx`
- [x] `src/View/Admin/View/ViewCustomRubrics/AdminViewCustomRubrics.tsx`
- [x] `src/View/Admin/View/ViewDashboard/AssessmentDashboard.tsx`
- [x] `src/View/Admin/View/ViewDashboard/Notifications.tsx`
- [x] `src/View/Admin/View/ViewDashboard/RosterDashboard.tsx`
- [x] `src/View/Admin/View/ViewDashboard/TeamDashboard.tsx`
- [x] `src/View/Admin/View/ViewTeamMembers/AdminViewTeamMembers.tsx`
- [x] `src/View/Admin/View/ViewTeamMembers/ViewTeamMembers.tsx`
- [x] `src/View/Admin/View/ViewTeams/AdminViewTeams.tsx`
- [x] `src/View/Admin/View/ViewTeams/ViewTeams.tsx`
- [x] `src/View/Admin/View/ViewUsers/AdminViewUsers.tsx`
- [x] `src/View/Admin/View/ViewUsers/ViewUsers.tsx`

### Shared Components
- [x] `src/View/Components/AssessmentTaskDropdown.tsx`
- [x] `src/View/Components/BackButton.tsx`
- [x] `src/View/Components/BackButtonResource.tsx`
- [x] `src/View/Components/CategoryDropdown.tsx`
- [x] `src/View/Components/CourseInfo.tsx`
- [x] `src/View/Components/CustomDataTable.tsx`
- [x] `src/View/Components/DeleteConfirmation.tsx`
- [x] `src/View/Components/DropConfirmation.tsx`
- [x] `src/View/Components/InfoChip.tsx`
- [x] `src/View/Components/MainHeader.tsx`
- [x] `src/View/Components/ReportingHeader.tsx`
- [x] `src/View/Components/SendMessageModal.tsx`
- [x] `src/View/Components/SendNotification.tsx`
- [x] `src/View/Components/StudentNavigation.tsx`

### Error / Login / Navbar
- [x] `src/View/Error/ErrorMessage.tsx`
- [x] `src/View/Login/Login.tsx`
- [x] `src/View/Login/SetNewPassword.tsx`
- [x] `src/View/Login/ValidateReset.tsx`
- [x] `src/View/Navbar/AppState.tsx`
- [x] `src/View/Navbar/BasicTabs.tsx`
- [x] `src/View/Navbar/Navbar.tsx`
- [x] `src/View/Navbar/PrivacyPolicy.tsx`
- [x] `src/View/Navbar/UserAccount.tsx`

### Student
- [x] `src/View/Student/StudentDashboard.tsx`
- [x] `src/View/Student/View/AssessmentTask/StudentViewAssessmentTask.tsx`
- [x] `src/View/Student/View/AssessmentTask/StudentViewAssessmentTaskInstructions.tsx`
- [x] `src/View/Student/View/AssessmentTask/ViewAssessmentTaskInstructions.tsx`
- [x] `src/View/Student/View/AssessmentTask/ViewAssessmentTasks.tsx`
- [x] `src/View/Student/View/BuildTeam/BuildTeam.tsx`
- [x] `src/View/Student/View/BuildTeam/ShowTeamMembers.tsx`
- [x] `src/View/Student/View/BuildTeam/StudentBuildTeam.tsx`
- [x] `src/View/Student/View/CompletedAssessmentTask/StudentCompletedAssessmentTasks.tsx`
- [x] `src/View/Student/View/CompletedAssessmentTask/ViewCompletedAssessmentTasks.tsx`
- [x] `src/View/Student/View/Components/CustomButton.tsx`
- [x] `src/View/Student/View/ConfirmCurrentTeam/ConfirmCurrentTeam.tsx`
- [x] `src/View/Student/View/ConfirmCurrentTeam/StudentConfirmCurrentTeam.tsx`
- [x] `src/View/Student/View/SelectTeam/SelectTeam.tsx`
- [x] `src/View/Student/View/StudentViewTeams.tsx`
- [x] `src/View/Student/View/TAViewTeams.tsx`
- [x] `src/View/Student/View/Team/StudentTeamMembers.tsx`
- [x] `src/View/Student/View/Team/TeamMembers.tsx`
- [x] `src/View/Student/View/TeamPassword/CodeRequirement.tsx`
- [x] `src/View/Student/View/ViewTeams.tsx`
- [x] `src/View/Student/View/ViewTeamsTA.tsx`

### Root / Utilities
- [x] `src/global.d.ts`
- [x] `src/testUtilities.ts`
- [x] `src/types/CompleteAssessmentTask.tsx`
- [x] `src/utility.ts`
- [x] `css.d.ts` — removed; CSS module declaration merged into `src/global.d.ts`
