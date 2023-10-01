import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pages(),
    tsconfigPaths(),
  ],
});
