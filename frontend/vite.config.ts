import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react({
      include: ["./src/webview/**/{*.ts,*.tsx}"],
    }),
  ],
  build: {
    outDir:"build/webview",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
      },
      output: {
        entryFileNames: 'index.js',
      }
    },
  },
});
