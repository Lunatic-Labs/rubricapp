import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    // Add styling for the paper/root element to ensure proper background
    // @ts-ignore: MUIDataTable custom component
    MUIDataTable: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--table-toolbar)",
        },
      },
    },
    // Style the pagination component
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
        selectIcon: {
          color: "var(--table-text)",
        },
        actions: {
          color: "var(--table-text)",
        },
      },
    },
    // Style the select dropdown in the toolbar
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
        icon: {
          color: "var(--table-text)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
          backgroundColor: "var(--dropdown-bg)",
          '&.Mui-selected': {
            backgroundColor: "var(--dropdown-selected)",
          },
          '&.Mui-selected:hover': {
            backgroundColor: "var(--dropdown-selected)",
          },
          '&:hover': {
            backgroundColor: "var(--dropdown-hover)",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
      },
    },
    // Style the paper component used for dropdowns
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--table-toolbar)",
        },
        outlined: {
          backgroundColor: "var(--table-toolbar)",
        },
      },
    },
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--dropdown-bg)",
          color: "var(--table-text)",
        },
        header: {
          backgroundColor: "var(--dropdown-bg)",
          color: "var(--table-text)",
        },
        resetLink: {
          color: "var(--table-text)",
        },
      },
    },
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableFilterList: {
      styleOverrides: {
        root: {
          color: "var(--table-text)",
        },
      },
    },
  },
});

const CustomDataTable = ({
  data,
  columns,
  options
}: any) => {
  const defaultOptions = {
    rowStyle: { height: 4 },
  };

  const tableOptions = { ...defaultOptions, ...options };

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