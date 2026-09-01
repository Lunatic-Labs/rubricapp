/// <reference types="vite/client" />

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

import type {} from '@mui/x-data-grid/themeAugmentation';
