import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // <--- NUEVA IMPORTACION
import expressStaticGzip from 'express-static-gzip'; // <--- NUEVA IMPORTACION
import puntosRoutes from './routes/puntos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://bagazo-frontend.onrender.com'; 

// --- Configuración de la Carpeta Frontend (Ruta absoluta) ---
// Obtener el directorio actual del backend y apuntar a la carpeta 'dist' del frontend
// NOTA: Esto asume que la carpeta 'dist' se genera en la raiz del monorepo
// AJUSTE PARA DOCKER: Se usa path.resolve('dist') porque en el contenedor la carpeta esta local
const frontendDistPath = path.resolve('dist'); 

// Middleware
app.use(express.json());
// Logging simple de peticiones (util para evidencias)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// CORS (origenes permitidos configurables)
app.use(cors({ origin: CORS_ORIGIN }));

// Parse URL-encoded (si se reciben formularios)
app.use(express.urlencoded({ extended: true }));

// ==============================================
//  SERVIR EL FRONTEND Y BROTLI (PASO CLAVE)
// ==============================================

app.use('/', expressStaticGzip(frontendDistPath, {
  enableBrotli: true,
  index: 'index.html',
  serveStatic: {
    maxAge: '365d'
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
// Rutas no encontradas para API -> responder JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta API no encontrada' });
});

// Fallback: servir index.html para rutas del cliente (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send("Archivo index.html no encontrado en el contenedor");
    }
  });
});

// Middleware de manejo de errores (ultimo middleware)
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

// Iniciar servidor
// AJUSTE PARA DOCKER: Se agrega '0.0.0.0' para permitir conexiones externas al contenedor
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Backend ejecutándose en puerto ${PORT}`);
  console.log(` Frontend servido desde: ${frontendDistPath}`);
});