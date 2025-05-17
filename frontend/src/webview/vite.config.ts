// src/webview/vite.config.ts  ← サブディレクトリ側の config
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: '.',                      // ここの . は “src/webview” を指す
  plugins: [react()],
  build: {
    /** ★ ルート直下の build/webview へ吐き出す */
    outDir: resolve(__dirname, '../../build/webview'),
    emptyOutDir: true,

    rollupOptions: {
      /** エントリ HTML は同階層の index.html */
      input: resolve(__dirname, 'index.html'),

      /** ファイル名を固定 (index.js) にすると extension.ts が読みやすい */
      output: {
        entryFileNames: 'index.js'
      }
    }
  }
});
