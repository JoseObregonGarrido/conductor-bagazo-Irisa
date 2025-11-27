import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puntosRoutes from './routes/puntos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'; // Origen por defecto

// Middleware
app.use(express.json());

// >>> INICIO: FIX CORS para Producción Local <<<
app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin 'origin' (como Postman o peticiones del mismo servidor)
    if (!origin) return callback(null, true); 
    
    // Permite el origen de desarrollo configurado
    if (origin === CORS_ORIGIN) return callback(null, true); 
    
    // PERMITE CUALQUIER PUERTO DE LOCALHOST (para pruebas con 'serve -s dist')
    if (origin.startsWith('http://localhost:')) return callback(null, true); 

    // Rechaza cualquier otro origen
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));



// Rutas
app.use('/api/puntos', puntosRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando correctamente' });
});

// Manejo de errores 404 (Si no hay peticiones a /api/*)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend ejecutándose en puerto ${PORT}`);
  console.log(`🌐 CORS habilitado dinámicamente para Localhost`);
});