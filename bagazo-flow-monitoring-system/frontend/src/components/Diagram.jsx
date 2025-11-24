import '../styles/Diagram.css';
import Model3D from './Model3D';

export default function Diagram({ puntos, onPuntoClick }) {
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
    console.log('Punto clickeado:', punto);
    onPuntoClick(punto);
  };

  return (
    <div className="diagram-container">
      <h2 className="diagram-title"> Conductores de Bagazo</h2>
      
      <div className="diagram-content">
        {/* Modelo 3D */}
        <div className="diagram-image-wrapper">
          <Model3D />
        </div>

        {/* Leyenda */}
        <div className="diagram-legend">
          <p className="legend-title">Selecciona un punto para ver los detalles:</p>
          <div className="legend-items">
            {puntos.map((punto) => {
              return (
                <button
                  key={punto.id}
                  className="legend-item"
                  style={{ 
                    backgroundColor: getColorClass(punto.color),
                    opacity: 0.7
                  }}
                  onClick={() => handlePuntoClick(punto)}
                  title={punto.nombre}
                >
                  <span className="legend-number">{punto.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="diagram-hint">Haz clic en cualquier cuadro para ver la información completa del Cuadrado</p>
    </div>
  );
}