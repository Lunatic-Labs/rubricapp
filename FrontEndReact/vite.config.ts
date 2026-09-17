import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@mui/icons-material': '@mui/icons-material/esm',
    },
  },

  //legacy: {
  //  inconsistentCjsInterop: true,
  //},

  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});