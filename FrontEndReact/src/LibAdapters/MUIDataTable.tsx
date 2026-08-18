// src/LibAdapters/MUIDataTable.tsx
import * as MUIDataTableModule from 'mui-datatables';

type MUIDataTableComponent = typeof MUIDataTableModule.default;

// Vite's CJS interop wraps the module namespace under an extra `.default`
// layer, while Jest's babel-jest interop does not. Pick whichever unwrap
// depth actually yields a component so this works under both.
const resolved = MUIDataTableModule as unknown as {
  default?: { default?: MUIDataTableComponent } & MUIDataTableComponent;
};
const MUIDataTable = (resolved.default?.default ?? resolved.default) as MUIDataTableComponent;

export default MUIDataTable;