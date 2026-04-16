import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/';
import { useMediaQuery } from '@mui/material';

const customTheme = createTheme({
  spacing: 4,
  components: {
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
        },
      },
    },
  MUIDataTableFooter: {
  styleOverrides: {
    root: {
        padding: ".01rem .5rem",
      fontSize: "1rem",
      width: '100%',
      boxSizing: 'border-box',
      '@media (max-width: 600px)': {
        padding: '0px',
        width: '100%',
        overflowX: 'hidden',
        display: 'flex',
        justifyContent: 'flex-end'
      }
    },
    
  },
},
MuiToolbar: {
  styleOverrides: {
    root: {
      padding: ".01rem .5rem",
      margin: ".01rem",
      fontSize: "1rem",
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
        fontSize: '0.75rem',
        margin: '0px',
      }
    },
    actions: {
      '@media (max-width: 600px)': {
        marginLeft: '0px',
      }
    }
  }
},
  },
}
);

const CustomDataTable = ({
  data,
  columns,
  options
}: any) => {
    const isMobile = useMediaQuery('(max-width:600px)');
  
    const defaultOptions = {
    rowStyle: { height: 4 },
    responsive: isMobile ? "vertical" : "standard",
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
