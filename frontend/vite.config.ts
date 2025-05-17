// menpro/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: './src/webview',                 // ← ここがポイント
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'build/webview'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/webview/index.html'),
      output: { entryFileNames: 'index.js' }
    }
  }
});
