import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify('2.0.0') },
  build: { outDir: '../v2', emptyOutDir: true, assetsInlineLimit: 0 },
  plugins: [
    preact(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/*.png', 'catalog.json', 'packs/*.json'],
      manifest: {
        id: './',
        name: "Cay's English V2",
        short_name: "Cay's English V2",
        description: 'Belajar grammar bahasa Inggris mengikuti kurikulum English Grammar in Use.',
        lang: 'id',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBFCF8',
        theme_color: '#1B2A4A',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        cacheId: 'cays-v2',
        globPatterns: ['**/*.{js,css,html,woff2,png,json,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      }
    })
  ],
  test: { environment: 'node' }
} as any);
