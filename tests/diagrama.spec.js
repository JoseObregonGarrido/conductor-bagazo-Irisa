// Archivo: tests/diagrama.spec.js
import { test, expect } from '@playwright/test';

// 🛑 URL CORREGIDA: Apunta al puerto 5000, donde corre tu aplicación.
const APP_URL = 'http://localhost:5000'; 

test.describe('Regresión Visual del Diagrama 3D', () => {

    // El test verifica la carga de la vista y toma la captura.
    test('La vista principal y el diagrama cargan correctamente', async ({ page }) => {
        
        // 1. Navegar a la URL de tu aplicación.
        await page.goto(APP_URL);

        // 2. Esperar a que el contenido crítico del InfoPanel sea visible.
        // Esto confirma que la aplicación cargó y recibió datos del backend.
        await expect(page.getByText('Tipo: Recolector')).toBeVisible({ timeout: 10000 });

        // 3. Identificar el contenedor principal del contenido (donde está el diagrama 3D).
        const contentGrid = page.locator('.content-grid'); 
        
        // 4. Crear o comparar la captura del elemento con la imagen de referencia.
        await expect(contentGrid).toHaveScreenshot('diagrama-bagazo.png', {
            // Tolerancia permitida para diferencias sutiles de renderizado (necesario para 3D).
            threshold: 0.2, 
        });

        // 5. Opcional: Tomar una captura de toda la página para revisión completa.
        await expect(page).toHaveScreenshot('pagina-completa.png', { fullPage: true });
    });
});