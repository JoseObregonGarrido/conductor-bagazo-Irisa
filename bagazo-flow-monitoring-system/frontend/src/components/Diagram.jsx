import { useState } from 'react';
import '../styles/Diagram.css';
import Model3D from './Model3D';

export default function Diagram({ puntos, onPuntoClick }) {
  const [puntoActivo, setPuntoActivo] = useState(null);

  const getColorClass = (color) => {
    const colorMap = {
      red: '#B81D1D',
      green: '#006B42',
      yellow: '#A06000', // WCAG 2 AA compliant (4.57:1)
      blue: '#1B4965'
    };
    return colorMap[color] || '#B81D1D';
  };

  const handlePuntoClick = (punto) => {
    setPuntoActivo(punto.id);
    onPuntoClick?.(punto); // Optional chaining for safety
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
          <div className="legend-items" role="group" aria-label="Conductores">
            {puntos.map((punto) => (
              <button
                key={punto.id}
                className={`legend-item ${puntoActivo === punto.id ? 'active' : ''}`}
                style={{ 
                  backgroundColor: getColorClass(punto.color)
                }}
                onClick={() => handlePuntoClick(punto)}
                title={punto.nombre}
                aria-label={`Conductor ${punto.nombre}`}
                aria-pressed={puntoActivo === punto.id}
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