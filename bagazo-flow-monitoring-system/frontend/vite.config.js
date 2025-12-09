import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// Configuración de Vite optimizada
export default defineConfig({
    plugins: [
        react(),
        // 1. Crea un gráfico visual del peso de los archivos al hacer build
        visualizer({
            open: true,       // Abre el reporte automáticamente en el navegador
            gzipSize: true,   // Muestra el tamaño comprimido en Gzip
            brotliSize: true, // Muestra el tamaño comprimido en Brotli
        }),
        // 2. Comprime los archivos finales para reducir el "Transfer Size"
        viteCompression({
            algorithm: 'brotliCompress', // Usamos Brotli que comprime más que Gzip
        })
    ],
    server: {
        port: 5173,
        strictPort: false,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        // Subimos la alerta de tamaño porque Three.js es pesado por naturaleza
        chunkSizeWarningLimit: 1600, 
        rollupOptions: {
            output: {
                // 3. Estrategia manual para separar librerías (Code Splitting)
                manualChunks(id) {
                    // Separa Three.js en un archivo aparte
                    if (id.includes('node_modules/three')) {
                        return 'vendor-three';
                    }
                    // Separa React en un archivo aparte
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'vendor-react';
                    }
                }
            }
        }
    }
})