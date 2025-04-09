import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any path aliases if needed
    },
  },
  optimizeDeps: {
    include: ['react-router-dom'], // Include react-router-dom in optimization
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      external: [], // Don't externalize any packages by default
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'date-utils': ['date-fns'],
          'chart-libs': ['recharts'], // Changed from chart.js to recharts which is in package.json
        }
      }
    }
  }
});
