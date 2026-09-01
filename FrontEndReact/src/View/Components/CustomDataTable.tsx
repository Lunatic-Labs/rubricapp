import React from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';

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
        },
        columnHeaders: {
          backgroundColor: 'var(--table-header)',
        },
        columnHeader: {
          fontSize: '1.4rem',
          padding: '.01rem .5rem',
          color: 'var(--table-text)',
        },
        columnHeaderTitle: {
          color: 'var(--table-text)',
        },
        cell: {
          fontSize: '1.5rem',
          padding: '.01rem .5rem',
          alignItems: 'center',
          color: 'var(--table-text)',
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

const defaultOptions: Partial<DataGridProps> = {
  disableRowSelectionOnClick: true,
  pageSizeOptions: [10, 25, 50],
  initialState: {
    pagination: { paginationModel: { pageSize: 10 } },
  },
};

const CustomDataTable = ({ data, columns, getRowId, height = "50vh", options }: CustomDataTableProps) => {
  const gridOptions = { ...defaultOptions, ...options };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ height, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={getRowId}
          {...gridOptions}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CustomDataTable;
