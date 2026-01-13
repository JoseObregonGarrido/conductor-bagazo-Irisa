import { useState, lazy, Suspense } from 'react'; // Importamos lazy y Suspense aquí también
import '../styles/Diagram.css';

//  Importación Dinámica: Solo carga el JS de Model3D cuando Diagram se monta.
const Model3D = lazy(() => import('./Model3D'));

export default function Diagram({ puntos, onPuntoClick }) {
  const [puntoActivo, setPuntoActivo] = useState(null);

  const getColorClass = (color) => {
    // ... código de getColorClass
    const colorMap = {
      red: '#B81D1D',
      green: '#006B42',
      yellow: '#A06000',
      blue: '#1B4965'
    };
    return colorMap[color] || '#B81D1D';
  };

  const handlePuntoClick = (punto) => {
    setPuntoActivo(punto.id);
    onPuntoClick?.(punto);
  };

  return (
    <div className="diagram-container">
      <h2 className="diagram-title">Conductores de Bagazo</h2>
      
      <div className="diagram-content">
        
        {/* Suspense para el Modelo 3D */}
        <div className="diagram-image-wrapper">
          <Suspense fallback={<div>Cargando Modelo 3D...</div>}>
            <Model3D />
          </Suspense>
        </div>

        {/* Leyenda (código ligero que se carga rápido) */}
        <div className="diagram-legend">
          {/* ... resto del código de la leyenda ... */}
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