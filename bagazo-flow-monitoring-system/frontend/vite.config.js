import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para el proyecto React
export default defineConfig({
    // Plugins usados por Vite (aquí React)
    plugins: [react()],

    // Opciones del servidor de desarrollo
    server: {
        // Puerto en el que se sirve la app durante el desarrollo
        port: 5173,
        // Si true y el puerto está ocupado, Vite fallará en lugar de buscar otro
        strictPort: false,
        // Abre el navegador automáticamente cuando se inicia el servidor
        open: true
    },

    // Opciones de construcción para producción
    build: {
        // Carpeta de salida donde se genera el bundle
        outDir: 'dist',
        // Generar o no sourcemaps (útil para depuración en producción)
        sourcemap: false
    }
})