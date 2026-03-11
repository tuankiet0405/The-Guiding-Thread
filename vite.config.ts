import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // Remove console.log in production
        drop_debugger: true,
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps for debugging (optional, can disable for smaller deploy)
    sourcemap: false,
  },
});
