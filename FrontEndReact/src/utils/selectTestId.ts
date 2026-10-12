import type { HTMLAttributes } from 'react';

// A MUI Select's own data-testid lands on a hidden <input>, not the element
// users click, so tests hook the clickable combobox via SelectDisplayProps
// instead (see JestTestDocumentation.md). SelectDisplayProps' type doesn't
// list data-* attributes, hence the one cast here rather than at every call:
//   <Select SelectDisplayProps={selectTestId("course-time-zone-dropdown")} />
export function selectTestId(testId: string): HTMLAttributes<HTMLDivElement> {
  return { "data-testid": testId } as HTMLAttributes<HTMLDivElement>;
}
