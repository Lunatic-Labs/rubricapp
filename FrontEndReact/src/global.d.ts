/// <reference types="react" />

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

// CSS module imports (with named exports)
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
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
