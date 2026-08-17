// src/LibAdapters/MUIDataTable.tsx
import * as MUIDataTableModule from 'mui-datatables';

type MUIDataTableComponent = typeof MUIDataTableModule.default;

const MUIDataTable = (
  MUIDataTableModule.default as unknown as {
    default: MUIDataTableComponent;
  }
).default;

export default MUIDataTable;