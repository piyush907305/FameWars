import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const at = (p: string) => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
  root: 'packages/client',
  resolve: {
    alias: {
      '@fame/sim': at('./packages/sim/src/index.ts'),
      '@fame/content': at('./packages/content/src/index.ts'),
      '@fame/ai': at('./packages/ai/src/index.ts'),
    },
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/three/')) return 'three';
          if (id.includes('/react') || id.includes('/scheduler/')) return 'react';
        },
      },
    },
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
