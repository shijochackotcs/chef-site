import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Allows deploying under a subpath like /chef-site/ on GitHub Pages
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
});
