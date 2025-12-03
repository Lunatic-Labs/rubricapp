import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  spacing: 4,
  fontSize: "1.5rem",
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
    MUIDataTableBodyRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'var(--light_grey_ADA)',
            '&:hover': {
              backgroundColor: 'var(--light_grey_hover) !important',
            },
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'var(--table-odd-row)',
            '&:hover': {
              backgroundColor: 'var(--table-odd-row-hover) !important',
            },
          },
        },
      },
    },
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--table-toolbar)",
          color: "var(--table-text)",
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
        },
      },
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          padding: ".01rem .5rem",
          fontSize: "1rem",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: ".01rem .5rem",
          margin: ".01rem",
          fontSize: "1rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          padding: ".01rem .5rem",
          color: "var(--table-text)",
        },
      },
    },
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
    MUIDataTableHead: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: 'space-around',
          //fontSize: "1.5rem",
          //padding: ".01rem 2rem",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--table-toolbar)',
          '&.MuiPopover-paper': {
            backgroundColor: 'var(--dropdown-bg) !important',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: 'var(--table-text)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'var(--table-text) !important',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'var(--table-text) !important',
          fill: 'var(--table-text) !important',
        },
      },
    },
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--dropdown-bg) !important',
          color: 'var(--dropdown-text) !important',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--dropdown-bg) !important',
          color: 'var(--dropdown-text) !important',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'var(--dropdown-text) !important',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--dropdown-icon)',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'var(--dropdown-label)',
        },
      },
    },
  },
});

const CustomDataTable = ({ data, columns, options }) => {
  const defaultOptions = {
    rowStyle: { height: 4 },
  };

  const tableOptions = { ...defaultOptions, ...options };

  return (
    <ThemeProvider theme={customTheme}>
      <MUIDataTable
        data={data}
        columns={columns}
        options={tableOptions}
      />
    </ThemeProvider>
  );
};

export default CustomDataTable;