import { resolve } from 'node:path'
import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        colecciones: resolve(__dirname, 'colecciones.html'),
        coleccionUp: resolve(__dirname, 'coleccion-up.html'),
        catalogoCompleto: resolve(__dirname, 'catalogo-completo.html'),
        privacidad: resolve(__dirname, 'privacidad.html'),
        terminos: resolve(__dirname, 'terminos.html'),
        cookies: resolve(__dirname, 'cookies.html'),
      },
    },
  },
  plugins: [{
    name: 'copy-products-js',
    closeBundle() {
      copyFileSync(
        resolve(__dirname, 'products.js'),
        resolve(__dirname, 'dist/products.js')
      )
    }
  }],
})
