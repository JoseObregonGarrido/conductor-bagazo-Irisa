import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de datos
const puntosFilePath = path.join(__dirname, '../data/puntos.json');

// Función para leer los datos
const leerPuntos = () => {
  const datos = fs.readFileSync(puntosFilePath, 'utf-8');
  return JSON.parse(datos);
};

// GET - Obtener todos los puntos
router.get('/', (req, res) => {
  try {
    const puntos = leerPuntos();
    res.json(puntos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los puntos' });
  }
});

// GET - Obtener un punto específico por ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const puntos = leerPuntos();
    const punto = puntos.find(p => p.id === parseInt(id));

    if (!punto) {
      return res.status(404).json({ error: `Punto ${id} no encontrado` });
    }

    res.json(punto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el punto' });
  }
});

export default router;