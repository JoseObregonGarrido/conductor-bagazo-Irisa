import { useState } from 'react';
import '../styles/Diagram.css';
import Model3D from './Model3D';

export default function Diagram({ puntos, onPuntoClick }) {
  const [puntoActivo, setPuntoActivo] = useState(null);

  const getColorClass = (color) => {
    const colorMap = {
      red: '#DC3545',
      green: '#00A352',
      yellow: '#FF9800',
      blue: '#3b82f6'
    };
    return colorMap[color] || '#DC3545';
  };

  const handlePuntoClick = (punto) => {
    setPuntoActivo(punto.id);
    onPuntoClick(punto);
  };

  return (
    <div className="diagram-container">
      <h2 className="diagram-title">Conductores de Bagazo</h2>
      
      <div className="diagram-content">
        {/* Modelo 3D */}
        <div className="diagram-image-wrapper">
          <Model3D />
        </div>

        {/* Leyenda */}
        <div className="diagram-legend">
          <p className="legend-title">Selecciona un conductor para ver los detalles:</p>
          <div className="legend-items">
            {puntos.map((punto) => (
              <button
                key={punto.id}
                className={`legend-item ${puntoActivo === punto.id ? 'active' : ''}`}
                style={{ 
                  backgroundColor: getColorClass(punto.color),
                  opacity: puntoActivo === punto.id ? 1 : 0.7
                }}
                onClick={() => handlePuntoClick(punto)}
                title={punto.nombre}
              >
                <span className="legend-number">{punto.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="diagram-hint">Haz clic en cualquier conductor para ver la información completa</p>
    </div>
  );
}