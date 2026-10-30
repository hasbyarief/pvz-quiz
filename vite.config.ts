
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    // GitHub Pages repository URL: /pvz-quiz/
    base: '/pvz-quiz/',

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
