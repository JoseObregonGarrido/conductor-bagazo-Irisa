import React, { useState, useEffect } from 'react';

import Header from './components/Header.jsx';
import Footer from "./components/Footer.jsx";
import Diagram from './components/Diagram.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import { obtenerPuntos, verificarBackend } from './services/api.js';
import './App.css';


function App() {
  const [puntos, setPuntos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await verificarBackend();
        const datos = await obtenerPuntos();
        setPuntos(datos);
        setError(null);
      } catch (err) {
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
            <h2>⚠️ Error de Conexión</h2>
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
          <div className="diagram-section">
                    {puntos.length > 0 ? (
                        <Diagram 
                            puntos={puntos} 
                            onPuntoClick={handlePuntoSeleccionado}
                        />
                    ) : (
                        <p className="no-data">No hay datos disponibles</p>
                    )}
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

export default App;