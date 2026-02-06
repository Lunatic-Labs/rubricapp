import '@mui/material/styles';

// CSS module imports (with named exports)
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Side-effect CSS imports from node_modules
declare module 'bootstrap/dist/css/bootstrap.css';
declare module '@fontsource/roboto/300.css';
declare module '@fontsource/roboto/400.css';
declare module '@fontsource/roboto/500.css';
declare module '@fontsource/roboto/700.css';

// Image imports
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// MUIDataTable module declaration
declare module 'mui-datatables' {
  import { ComponentType } from 'react';
  
  interface MUIDataTableProps {
    title?: string;
    data: any[];
    columns: any[];
    options?: any;
  }
  
  const MUIDataTable: ComponentType<MUIDataTableProps>;
  export default MUIDataTable;
}

// Extend MUI theme to include MUIDataTable components
declare module '@mui/material/styles' {
  interface Components {
    MUIDataTableBodyCell?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
    MUIDataTableBodyRow?: {
      styleOverrides?: {
        root?: React.CSSProperties | Record<string, any>;
      };
    };
    MUIDataTableToolbar?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
    MUIDataTableFooter?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
    MUIDataTableHeadCell?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
  }
}