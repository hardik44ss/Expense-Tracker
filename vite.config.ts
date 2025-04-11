import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  optimizeDeps: {
    include: ['react-router-dom', 'framer-motion', 'recharts', 'chart.js', 'react-chartjs-2'],
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'date-utils': ['date-fns'],
          'chart-libs': ['recharts', 'chart.js', 'react-chartjs-2'],
          'ui': ['framer-motion', 'lucide-react'],
        }
      }
    }
  }
});
