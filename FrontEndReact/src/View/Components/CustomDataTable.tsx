import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { useMediaQuery } from '@mui/material';

interface CustomDataTableProps {
    data: object[];
    columns: any[];
    options?: Record<string, unknown>;
}

const customTheme = createTheme({
  spacing: 4,
  components: {
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          padding: ".01rem .5rem",
          margin: ".01rem",
          alignItems: "center",
          color: "var(--table-text)",
        },
      },
    },
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableBodyRow: {
      styleOverrides: {
        root: {
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
      },
    },
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--table-toolbar)",
          color: "var(--table-text)",
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
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableFooter: {
      styleOverrides: {
        root: {
          padding: ".01rem .5rem",
          fontSize: "1rem",
          backgroundColor: "var(--table-toolbar)",
          color: "var(--table-text)",
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
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--table-header)",
          color: "var(--table-text)",
          padding: ".01rem .5rem", 
          fontSize: "1.4rem",
        },
      },
    },
    MUIDataTablePagination: {
    styleOverrides: {
    root: {
      '@media (max-width: 600px)': {
        flexWrap: 'wrap',
        padding: '0px',
        width: '100%',
      }
    },
  },
},
MuiTablePagination: {
  styleOverrides: {
    root: {
      '@media (max-width: 600px)': {
        width: '100%',
        overflowX: 'hidden',
      }
    },
    toolbar: {
      '@media (max-width: 600px)': {
        flexWrap: 'wrap',
        padding: '4px 0px',
        justifyContent: 'flex-end',
        width: '100%',
        gap: '4px',
      }
    },
    spacer: {
      '@media (max-width: 600px)': {
        display: 'none',
      }
    },
    selectLabel: {
      '@media (max-width: 600px)': {
        fontSize: '0.75rem',
        margin: '0px',
      }
    },
    displayedRows: {
      '@media (max-width: 600px)': {
        fontSize: '0.85rem',
      }
    },
  }
},
  },
}
);

const CustomDataTable = ({ data, columns, options }: CustomDataTableProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultOptions = {
    rowStyle: { height: 4 },
    responsive: (isMobile ? "vertical" : "standard") as "vertical" | "standard",
  };

  const tableOptions = { ...defaultOptions, ...options,}

  return (
    <ThemeProvider theme={customTheme}>
      <MUIDataTable
        title=""
        data={data}
        columns={columns}
        options={tableOptions}
      />
    </ThemeProvider>
  );
};

export default CustomDataTable;