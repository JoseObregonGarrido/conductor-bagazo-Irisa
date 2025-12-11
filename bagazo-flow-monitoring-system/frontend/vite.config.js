// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
    // La propiedad 'base: "./"' es crucial para usar rutas relativas 
    // en los assets compilados. Esto asegura que la aplicación se cargue 
    // correctamente desde cualquier subdirectorio del servidor, lo que 
    // resuelve el problema de localización de archivos en el renderizado de Googlebot.
    base: './', 
    
    // Directorio que se copia directamente a 'dist' (contiene robots.txt, favicon, etc.).
    publicDir: 'public',
    
    plugins: [
        react(),
        // Genera un mapa visual del tamaño de los módulos.
        visualizer({
            open: false,
            gzipSize: true,   
            brotliSize: true, 
        }),
        // Comprime los archivos finales usando Brotli para reducir el tamaño de transferencia.
        viteCompression({
            algorithm: 'brotliCompress', 
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
        // Incrementa el límite de advertencia por el tamaño inherente de Three.js.
        chunkSizeWarningLimit: 1600, 
        rollupOptions: {
            output: {
                // Estrategia de separación de código (Code Splitting) para aislar librerías pesadas.
                manualChunks(id) {
                    // Separa Three.js.
                    if (id.includes('node_modules/three')) {
                        return 'vendor-three';
                    }
                    // Separa React y React-DOM.
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'vendor-react';
                    }
                }
            }
        }
    }
})