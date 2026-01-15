const API_BASE_URL = 'https://bagazo-backend.onrender.com/api';

// Obtener todos los puntos
export const obtenerPuntos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/puntos`);
    if (!response.ok) {
      throw new Error('Error al obtener los puntos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerPuntos:', error);
    throw error;
  }
};

// Obtener un punto especifico por ID
export const obtenerPuntoPorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/puntos/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el punto ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en obtenerPuntoPorId(${id}):`, error);
    throw error;
  }
};

// Verificar estado del backend
export const verificarBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    if (!response.ok) {
      throw new Error('Backend no disponible');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    throw error;
  }
};