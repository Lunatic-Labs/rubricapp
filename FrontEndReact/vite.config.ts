import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sbLogo.png', 'favicon.ico', 'apple-touch-icon-180x180.png', 'robots.txt'],
      manifest: {
        name: 'SkillBuilder',
        short_name: 'SkillBuilder',
        description:
          'SkillBuilder is a platform for creating and managing skills, rubrics, assessments, and learning activities.',
        theme_color: '#2E8BEF',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Main bundle is ~2.7 MB; Workbox's 2 MiB default would skip precaching it.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],

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

  preview: {
    port: 4173,
    host: '0.0.0.0',
    // Lets `vite preview` be reached through a Cloudflare quick tunnel for
    // real-device PWA testing. The leading dot matches any subdomain, since
    // trycloudflare.com assigns a new random one on every run.
    allowedHosts: ['.trycloudflare.com'],
  },
});
