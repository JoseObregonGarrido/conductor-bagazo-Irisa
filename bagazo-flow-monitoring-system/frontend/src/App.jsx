import React, { useState, useEffect, lazy, Suspense } from 'react'; // <-- Se añadió lazy y Suspense
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import Footer from "./components/footer";
import { obtenerPuntos, verificarBackend } from './services/api';
import './App.css';

// 1. Carga diferida (Lazy Load) del componente Diagram
// Esto asegura que todo el código de Three.js y GLTFLoader se cargue en un CHUNK
// de archivo separado y solo cuando React lo solicite, reduciendo el TBT.
const Diagram = lazy(() => import('./components/Diagram')); 


export default function App() {
  const [puntos, setPuntos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Verificar si el backend está disponible
        await verificarBackend();
        
        // Cargar los puntos
        const datos = await obtenerPuntos();
        setPuntos(datos);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudo conectar con el backend. Asegúrate de que esté ejecutándose en el puerto 5000.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

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
            <p>Cargando datos...</p>
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
            <button onClick={() => window.location.reload()}>
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
                {/* Fallback: Muestra este mensaje o componente mientras carga el código de Diagram/Three.js */}
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