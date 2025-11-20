import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puntosRoutes from './routes/puntos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/puntos', puntosRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando correctamente' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend ejecutándose en puerto ${PORT}`);
  console.log(`🌐 CORS habilitado para: ${CORS_ORIGIN}`);
});