import React from 'react';
// @ts-ignore: allow importing mui-datatables without type declarations
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  spacing: 4,
  components: {
    // @ts-ignore: MUIDataTable custom component
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
    MUIDataTableFooter: {
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