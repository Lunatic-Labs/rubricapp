import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  components: {
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          padding: "0rem .5rem",
          alignItems:"center"
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
        },
      },
    },
    MuiDataTableFooter: {
      styleOverrides: {
        root: {
          padding: "0rem 0rem",
          fontSize: "1rem",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: "0rem 0rem",
          fontSize: "1rem",
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          backgroundColor: "#A4C4F4",
          padding: "0rem .5rem", 
          fontSize: "1.8rem",
        },
      },
    },
    MUIDataTableHead: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: 'space-around',
          fontSize: "1.8rem",
          padding: "0rem 2rem",
        },
      },
    },
  },
});

const customDataTable = ({ data, columns, options }) => {
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

export default customDataTable;
