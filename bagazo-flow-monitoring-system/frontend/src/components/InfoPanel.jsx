import { useState, useEffect } from 'react';
import '../styles/InfoPanel.css';

// Mover esta función a un archivo de utilidades (ej: utils/colors.js) si se usa en Diagram
const getColorClass = (color) => {
  const colorMap = {
    red: '#B81D1D',
    green: '#006B42',
    yellow: '#A06000', 
    blue: '#1B4965'
  };
  return colorMap[color] || '#B81D1D';
};

export default function InfoPanel({ punto, onClose }) {
  // Eliminamos el estado 'mostrarAnimacion' ya que usaremos 'key'
  // const [mostrarAnimacion, setMostrarAnimacion] = useState(false); 

 

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
    /*  CLAVE DE OPTIMIZACIÓN: Usar 'key' fuerza a React a recrear el DOM, 
       reiniciando la animación CSS sin necesidad de setTimeout. */
    <div className="info-panel animated" key={punto.id}> 
      <div className="info-header">
        <div className="punto-badge" style={{ backgroundColor: getColorClass(punto.color) }}>
          {punto.nombre}
        </div>
        <button className="close-button" onClick={onClose} title="Cerrar">
          ✕
        </button>
      </div>

      <div className="info-content">
        <div className="info-section description-section">
          <h4>Descripción:</h4>
          <p className="info-description">{punto.descripcion}</p>

          <h4>Tipo:</h4>
          <p className="info-type">{punto.tipo}</p>
        </div>
      </div>
    </div>
  );
}