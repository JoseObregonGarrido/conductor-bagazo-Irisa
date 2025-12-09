import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // <--- NUEVA IMPORTACIÓN
import expressStaticGzip from 'express-static-gzip'; // <--- NUEVA IMPORTACIÓN
import puntosRoutes from './routes/puntos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'; 

// --- Configuración de la Carpeta Frontend (Ruta absoluta) ---
// Obtener el directorio actual del backend y apuntar a la carpeta 'dist' del frontend
// NOTA: Esto asume que la carpeta 'dist' se genera en la raíz del monorepo
const frontendDistPath = path.join(path.resolve(), '..', 'frontend', 'dist'); // AJUSTA ESTA RUTA SI ES NECESARIO

// Middleware
app.use(express.json());

// >>> FIX CORS OMITIDO POR BREVEDAD, DEJAR TU CÓDIGO AQUÍ <<<
// ... (Tu código de app.use(cors({...})) debe ir aquí) ...

// ==============================================
// 🎯 SERVIR EL FRONTEND Y BROTLI (PASO CLAVE)
// ==============================================

app.use('/', expressStaticGzip(frontendDistPath, {
  enableBrotli: true, // Habilita la búsqueda de archivos .br
  index: 'index.html', // Archivo de inicio del frontend
  serveStatic: {
    maxAge: '365d' // Política de caché para los archivos estáticos
  }
}));
// 

// Rutas de API
app.use('/api/puntos', puntosRoutes);

// Ruta de prueba de API
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando correctamente' });
});

// ==============================================
// FALLBACK PARA ENRUTAMIENTO DEL CLIENTE (React Router)
// ==============================================
// Cualquier ruta que no sea un archivo estático o /api/* debe servir el index.html
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) return; // Ya manejado por el 404 abajo

  // Servir el index.html para que React Router maneje la ruta
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});


// Manejo de errores 404 para la API
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Frontend servido desde: ${frontendDistPath}`);
});