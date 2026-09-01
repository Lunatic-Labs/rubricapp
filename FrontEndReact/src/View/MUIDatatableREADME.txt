For most of the views, we use a shared component called CustomDataTable
(src/View/Components/CustomDataTable.tsx), which wraps @mui/x-data-grid's
DataGrid component. This file documents important information about how
to use it.

(This project previously used the `mui-datatables` package, which is
deprecated/unmaintained. It was replaced with @mui/x-data-grid in 2026.)

Explanation:

CustomDataTable takes `data`, `columns`, a required `getRowId`, and an
optional `height` and `options`. Each row object needs a unique id, which
`getRowId` extracts (most row objects use an entity-specific id field like
`user_id` or `team_id`, not a plain `id`).

const columns: GridColDef[] = [
  {
    field: "first_name",    // the field of the row object to read
    headerName: "First Name",  // what is displayed as the column label
    flex: 1,                // proportional width (or use `width` for a fixed px value)
  },
  {
    field: "last_name",
    headerName: "Last Name",
    flex: 1,
  },
];

return (
  <CustomDataTable
    data={users}
    columns={columns}
    getRowId={(row) => row.user_id}
    height="50vh"
  />
);

Custom cell rendering: use `renderCell: (params) => (...)` on a column
instead of a bespoke prop. `params.value` is that column's value on the
row; `params.row` is the full row object, which is useful when a column's
content depends on more than just its own field (e.g. an action button
column keyed off a synthetic field name — see below).

Duplicate/synthetic columns: a GridColDef's `field` must be unique across
the columns array. For a table with several action-button columns that
all need the same row id (e.g. Edit/Delete/View), give each a unique
synthetic field name (e.g. "edit_action", "delete_action") and read the
real id off `params.row` inside `renderCell`, rather than off `params.value`.

Filtering and sorting are on by default per column; set `filterable: false`
or `sortable: false` on a column to disable them (typically done for
action-button columns). Column alignment uses `align`/`headerAlign`
directly as column props (e.g. `align: "center"`) rather than a style
override function.

Styling: CustomDataTable's ThemeProvider already themes the DataGrid via
a `MuiDataGrid` component override (targeting classes like
`.MuiDataGrid-cell`, `.MuiDataGrid-columnHeader`, `.MuiDataGrid-row`) using
the app's `--table-*` CSS variables, so most tables don't need to touch
theming themselves. If a table has genuinely unique styling needs, prefer
passing `sx` via `options` over editing the shared theme, unless the
change should apply to every table.
