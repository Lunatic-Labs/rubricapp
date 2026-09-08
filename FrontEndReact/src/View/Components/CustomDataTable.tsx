import React from 'react';
import { Box, createTheme, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, ThemeProvider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridPreferencePanelsValue,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiContext,
} from '@mui/x-data-grid';

interface CustomDataTableProps {
  data: object[];
  columns: GridColDef[];
  getRowId: (row: any) => string | number;
  height?: string;
  options?: Partial<DataGridProps>;
}

const customTheme = createTheme({
  spacing: 4,
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: '0 0 0.3em var(--box-shadow)',
        },
        columnHeaders: {
          backgroundColor: 'var(--table-toolbar)',
        },
        columnHeader: {
          fontSize: '1.2rem',
          padding: '.01rem .3rem',
          color: 'var(--table-text)',
        },
        columnHeaderTitle: {
          color: 'var(--table-text)',
        },
        cell: {
          fontSize: '1.5rem',
          padding: '.3rem',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--table-text)',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: '1.3',
        },
        row: {
          '&:nth-of-type(even)': {
            backgroundColor: 'var(--light_grey_ADA)',
            '&:hover': {
              backgroundColor: 'var(--light_grey_hover)',
            },
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'var(--table-odd-row)',
            '&:hover': {
              backgroundColor: 'var(--table-odd-row-hover)',
            },
          },
        },
        toolbarContainer: {
          backgroundColor: 'var(--table-toolbar)',
          color: 'var(--table-text)',
          padding: '.5rem',
          justifyContent: 'flex-start',
        },
        footerContainer: {
          padding: '.01rem .5rem',
          fontSize: '1rem',
          backgroundColor: 'var(--table-toolbar)',
          color: 'var(--table-text)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          width: 'auto',
          maxWidth: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
          padding: ".01rem .5rem",
          margin: ".01rem",
          color: "var(--table-text)",
          backgroundColor: "transparent",
          '&:hover': {
            backgroundColor: "var(--light_grey_hover)",
          },
        },
        text: {
          color: "var(--table-text)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
          '&:hover': {
            backgroundColor: "var(--light_grey_hover)",
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: ".01rem .5rem",
          margin: ".01rem",
          fontSize: "1rem",
          backgroundColor: "var(--table-toolbar)",
          color: "var(--table-text)",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "inherit",
      },
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
        body2: {
          color: "var(--table-text)",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          padding: ".01rem .5rem",
          color: "var(--table-text)",
          backgroundColor: "var(--dropdown-bg)",
        },
        input: {
          color: "var(--table-text)",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
        input: {
          color: "var(--table-text)",
        },
        underline: {
          '&:before': {
            borderBottomColor: "var(--table-border)",
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: "var(--table-border)",
          },
          '&:after': {
            borderBottomColor: "var(--table-border)",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          width: '100%',
          overflowX: 'hidden',
        },
        toolbar: {
          flexWrap: 'wrap',
          padding: '4px 0px',
          justifyContent: 'flex-end',
          width: '100%',
          gap: '4px',
          minHeight: 'unset',
        },
        spacer: {
          display: 'none',
        },
        selectLabel: {
          fontSize: '0.75rem',
          margin: '0px',
        },
        displayedRows: {
          fontSize: '0.75rem',
          margin: '0px',
        },
        actions: {
          marginLeft: '0px',
          flexShrink: 0,
        }
      }
    },
  },
});

// Search box + Filters button on the left; Columns/Density/Export are
// combined into a single dropdown menu instead of separate toolbar buttons.
const CustomToolbar = () => {
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const closeMenu = () => setAnchorEl(null);
  const runAndClose = (action: () => void) => () => {
    action();
    closeMenu();
  };

  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
        <GridToolbarFilterButton />
        <IconButton
          size="small"
          aria-label="more table options"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={runAndClose(() => apiRef.current.setDensity('compact'))}>
          <ListItemIcon><DensitySmallIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Compact density</ListItemText>
        </MenuItem>
        <MenuItem onClick={runAndClose(() => apiRef.current.setDensity('standard'))}>
          <ListItemIcon><DensityMediumIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Standard density</ListItemText>
        </MenuItem>
        <MenuItem onClick={runAndClose(() => apiRef.current.setDensity('comfortable'))}>
          <ListItemIcon><DensityLargeIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Comfortable density</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={runAndClose(() => apiRef.current.exportDataAsCsv())}>
          <ListItemIcon><FileDownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Download as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={runAndClose(() => apiRef.current.exportDataAsPrint())}>
          <ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
      </Menu>
    </GridToolbarContainer>
  );
};

const TOOLBAR_HEIGHT = 52;
const COLUMN_HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 52;
const ROW_HEIGHT_ESTIMATE = 44;
const EMPTY_STATE_HEIGHT = 120;

const defaultOptions: Partial<DataGridProps> = {
  disableRowSelectionOnClick: true,
  pageSizeOptions: [10, 25, 50],
  initialState: {
    pagination: { paginationModel: { pageSize: 10 } },
  },
  getRowHeight: () => 'auto',
  columnHeaderHeight: COLUMN_HEADER_HEIGHT,
  disableColumnResize: true,
  slots: {
    toolbar: CustomToolbar,
  },
};

const CustomDataTable = ({ data, columns, getRowId, height = "70vh", options }: CustomDataTableProps) => {
  const gridOptions: Partial<DataGridProps> = {
    ...defaultOptions,
    ...options,
    slots: { ...defaultOptions.slots, ...options?.slots },
    slotProps: { ...defaultOptions.slotProps, ...options?.slotProps },
  };

  // Column-level menus (sort/filter/hide) are dropped in favor of the single
  // search box + Filters button in the toolbar above, so sorting stays on
  // header click but the per-column "..." menu no longer shows. `flex` is
  // also dropped so columns keep their fixed width instead of stretching to
  // fill the container, matching the old mui-datatables behavior where an
  // overflowing set of columns scrolled horizontally rather than shrinking.
  const columnsWithoutMenu = columns.map(({ flex, ...column }) => ({
    disableColumnMenu: true,
    ...column,
  }));

  // The DataGrid needs an explicit pixel/vh/etc. height (unlike the old
  // plain-<table>-based mui-datatables, which just sized itself to its
  // rows). To get that same "shrink to content" behavior back while still
  // keeping the DataGrid's sticky header + internal scrollbar for tables
  // that do have enough rows to overflow, estimate the content height from
  // the row count and cap it with the page's own `height` at render time
  // via CSS min() — that avoids converting between the mismatched units
  // (vh, %, rem, px) each page passes for `height`.
  const pageSize = gridOptions.initialState?.pagination?.paginationModel?.pageSize ?? 10;
  const rowsShown = Math.min(data.length, pageSize);
  const estimatedContentHeight =
    TOOLBAR_HEIGHT +
    COLUMN_HEADER_HEIGHT +
    FOOTER_HEIGHT +
    (data.length === 0 ? EMPTY_STATE_HEIGHT : rowsShown * ROW_HEIGHT_ESTIMATE);

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ height: `min(${estimatedContentHeight}px, ${height})`, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columnsWithoutMenu}
          getRowId={getRowId}
          {...gridOptions}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CustomDataTable;
