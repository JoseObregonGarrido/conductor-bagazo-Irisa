import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import Footer from "./components/footer.jsx";
import { obtenerPuntos, verificarBackend } from './services/api.js';
import './App.css';

// 1. Carga diferida (Lazy Load) del componente Diagram
// Esto aísla el código pesado de Three.js y GLTFLoader en un chunk separado.
const Diagram = lazy(() => import('./components/Diagram.jsx')); 


export default function App() {
  const [puntos, setPuntos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Implementamos una lógica de reintento con backoff (aunque simple)
    // para manejar fallos de conexión al backend de manera más robusta.
    const cargarDatos = async (retries = 3) => {
      try {
        await verificarBackend();
        const datos = await obtenerPuntos();
        setPuntos(datos);
        setError(null);
      } catch (err) {
        if (retries > 0) {
          console.warn(`Error al conectar. Reintentando en 2 segundos... (${retries} reintentos restantes)`);
          setTimeout(() => cargarDatos(retries - 1), 2000);
        } else {
          console.error('Error al cargar datos después de reintentos:', err);
          setError('No se pudo conectar con el backend. Asegúrate de que esté ejecutándose en el puerto 5000.');
          setCargando(false);
        }
      } finally {
        // Solo establecemos la carga a false si no hay errores fatales
        if (retries === 3 || error) {
            setCargando(false);
        }
      }
    };

    cargarDatos();
  }, [error]); 

  const handlePuntoSeleccionado = (punto) => {
    setPuntoSeleccionado(punto);
  };

  const handleCerrarPanel = () => {
    setPuntoSeleccionado(null);
  };

  if (cargando) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando datos iniciales...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="error">
            <h2>Error de Conexión</h2>
            <p>{error}</p>
            {/* Botón con estilos de Tailwind */}
            <button onClick={() => window.location.reload()} className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
              Intentar de nuevo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="content-grid">
          {/* 2. Se envuelve el componente Diagram con Suspense */}
          <div className="diagram-section">
            {/* Fallback: Muestra este mensaje mientras carga el código de Diagram/Three.js */}
            <Suspense fallback={<div className="loading-3d">Cargando la visualización 3D...</div>}>
              {puntos.length > 0 ? (
                <Diagram 
                  puntos={puntos} 
                  onPuntoClick={handlePuntoSeleccionado}
                />
              ) : (
                <p className="no-data">No hay datos disponibles</p>
              )}
            </Suspense>
          </div>
          <div className="info-section">
            <InfoPanel 
              punto={puntoSeleccionado} 
              onClose={handleCerrarPanel}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}