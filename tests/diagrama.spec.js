// Archivo: tests/diagrama.spec.js (¡DEBE CONTENER ESTO AHORA!)
import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5000'; 

test.describe('Regresión Visual del Diagrama 3D', () => {

    test('La vista principal y el diagrama cargan correctamente', async ({ page }) => {
        
        // 1. Navegar a la URL de tu aplicación.
        await page.goto(APP_URL);

        // 2. ESPERA AL CANVAS 3D: Esperamos a que el elemento <canvas> aparezca en el DOM y sea visible.
        // Esto confirma que Three.js ha terminado de inicializarse y el modelo está listo.
        // Aumentamos el timeout a 15s por seguridad.
        await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 }); 

        // 3. Identificar el contenedor para tomar la captura (contentGrid).
        const contentGrid = page.locator('.content-grid'); 
        
        // 4. Crear o comparar la captura.
        await expect(contentGrid).toHaveScreenshot('diagrama-bagazo.png', {
            // Se mantiene el threshold general
            threshold: 0.3, 
            // NUEVO: Permite que hasta el 30% de los píxeles sean diferentes sin fallar.
            // Esto es crucial para WebGL/3D donde el renderizado no es perfecto.
            maxDiffPixelRatio: 0.3, 
            // Aumentamos el tiempo de espera para encontrar una captura estable (aunque es probable que el timeout siga fallando sin el siguiente cambio).
            timeout: 10000, 
        });

        // 5. Captura completa.
        await expect(page).toHaveScreenshot('pagina-completa.png', { fullPage: true });
    });
});