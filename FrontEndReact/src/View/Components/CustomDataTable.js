import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  components: {
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: "1.7rem",
          padding: "4px",
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
          fontSize: "1.7rem",
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          backgroundColor: "#A4C4F4",
          padding: "12px", 
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
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "baseline",
          padding: "0.5rem",
        },
      },
    },
  },
});

const customDataTable = ({ data, columns, options }) => {
  const defaultOptions = {
    rowStyle: { height: 10 },
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
