import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    target: 'es2020'
  },
  server: {
    port: 1234,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api-docs': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './public'),
      'three$': path.resolve(__dirname, './node_modules/three/build/three.module.js'),
      'three': path.resolve(__dirname, './node_modules/three')
    }
  },
  optimizeDeps: {
    include: ['three', 'fengari-web']
  }
});
