import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import Footer from "./components/footer.jsx";
import { obtenerPuntos, verificarBackend } from './services/api.js';
import './App.css';
// import { FunctionOverloadingNode } from 'three/webgpu'; // Esto no se usa y puede causar errores

// 1. Carga diferida (Lazy Load) del componente Diagram
// Esto aísla el código pesado de Three.js y GLTFLoader en un chunk separado.
const Diagram = React.lazy(() => import('./components/Diagram.jsx')); 

export default function App() { // ÚNICA FUNCIÓN EXPORTADA
  const [puntos, setPuntos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Implementamos una lógica de reintento con backoff (aunque simple)
    const cargarDatos = async (retries = 3) => {
      // ... (Tu lógica de carga de datos y reintentos, que está correcta) ...
      // (Mantenemos la lógica de reintento tal como la tienes, solo enfocándonos en la estructura)
    };
    cargarDatos();
  }, [error]); 

  const handlePuntoSeleccionado = (punto) => {
    setPuntoSeleccionado(punto);
  };

  const handleCerrarPanel = () => {
    setPuntoSeleccionado(null);
  };

  // --- RENDERING BASADO EN ESTADO ---

  if (cargando) {
    // ... (Tu bloque de cargando, que está correcto) ...
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
          <div className="diagram-section">
            {/* 🎯 Aplicación correcta del Suspense y Lazy Loading */}
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