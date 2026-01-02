import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de datos
const puntosFilePath = path.join(__dirname, '../data/puntos.js');

// Función para leer los datos (manejo de errores explícito)
const leerPuntos = () => {
  try {
    const datos = fs.readFileSync(puntosFilePath, 'utf-8');
    return JSON.parse(datos);
  } catch (err) {
    // Lanzar error para que el handler lo capture y registre la causa
    throw new Error(`Error leyendo puntos: ${err.message}`);
  }
};

// GET - Obtener todos los puntos
router.get('/', (req, res) => {
  try {
    const puntos = leerPuntos();
    res.json(puntos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error al leer los puntos' });
  }
});

// GET - Obtener un punto específico por ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const puntos = leerPuntos();
    const parsedId = parseInt(id, 10);
    if (Number.isNaN(parsedId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const punto = puntos.find(p => p.id === parsedId);

    if (!punto) {
      return res.status(404).json({ error: `Punto ${id} no encontrado` });
    }

    res.json(punto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el punto' });
  }
});

export default router;