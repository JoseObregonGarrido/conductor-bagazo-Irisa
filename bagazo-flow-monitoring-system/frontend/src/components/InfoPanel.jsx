import { useState, useEffect } from 'react';
import '../styles/InfoPanel.css';

export default function InfoPanel({ punto, onClose }) {
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);

  useEffect(() => {
    if (punto) {
      setMostrarAnimacion(false);
      setTimeout(() => {
        setMostrarAnimacion(true);
      }, 50);
    }
  }, [punto?.id]);

  if (!punto) {
    return (
      <div className="info-panel">
        <div className="info-empty">
          <h3>Selecciona un Conductor</h3>
          <p>Haz clic en cualquier conductor (C1 a C12) de la leyenda para ver su descripción.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`info-panel ${mostrarAnimacion ? 'animated' : ''}`}>
      <div className="info-header">
        <div className="punto-badge" style={{ backgroundColor: punto.color }}>
          {punto.nombre}
        </div>
        <button className="close-button" onClick={onClose} title="Cerrar">
          ✕
        </button>
      </div>

      <div className="info-content">
        <div className="info-section">
          <p className="info-description">{punto.descripcion}</p>
        </div>
      </div>

      <div className="info-content">
        <div className="info-section">
          <p className="info-description">{punto.tipo}</p>
        </div>
      </div>
    </div>
  );
}