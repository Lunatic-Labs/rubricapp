import React from 'react';
// @ts-ignore: allow importing mui-datatables without type declarations
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  spacing: 4,
  fontSize: "1.5rem",
  components: {
    // @ts-ignore: MUIDataTable custom component
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          padding: ".01rem .5rem",
          margin: ".01rem",
          alignItems:"center"
        },
      },
    },
    MUIDataTableBodyRow: {                // This code creates an alternating background color for indivual rows.
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'var(--light_grey_ADA)', // Light gray for even rows
            '&:hover': {
              backgroundColor: 'var(--light_grey_hover) !important',
            },
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'white',     // White for odd rows
          },
          
        },
      },
    },
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
          padding: ".01rem .5rem",
          margin: ".01rem",
        },
      },
    },
    MuiDataTableFooter: {
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
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          backgroundColor: "#A4C4F4",
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
        data={data}
        columns={columns}
        options={tableOptions}
      />
    </ThemeProvider>
  );
};

export default CustomDataTable;
