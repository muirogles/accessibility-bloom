import { defineConfig } from 'vite';

// Base relativa: el build funciona en GitHub Pages con cualquier
// nombre de repositorio, sin configurar rutas absolutas.
export default defineConfig({
  base: './',
  build: { outDir: 'dist' }
});
