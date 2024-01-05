import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  components: {
    MUIDataTableBodyCell:{
      styleOverrides: {
      root:{
        fontSize:"14px"
      }
    },
    },
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
    MuiButton:{
      styleOverrides: {
        root:{
          fontSize:"14px"
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root:{
          backgroundColor: "#A4C4F4",
        }
      },
    },
    MUIDataTableHead: {
      styleOverrides: {
        root:{
          display: "flex",
          flexDirection:"row",
          justifyContent: 'space-around' ,
        }
      },
    },
    MuiToolbar: {
      styleOverrides:{
        root:{
          display:"flex",
          alignItems:"baseline",
          padding:"0.5rem"
        }
      }
    },
  },
});


const customDataTable = ({ data, columns, options }) => {
  
  const defaultOptions = {
    rowStyle: { height: 10 },
  };

  const tableOptions = { ...defaultOptions, ...options};

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
