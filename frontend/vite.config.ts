import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            three: ['three'],
            ui: ['@tanstack/react-query', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 3000,
      proxy: mode === 'development' ? {
        '/api': {
          target: env.REACT_APP_API_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      } : undefined,
    },
  };
});
