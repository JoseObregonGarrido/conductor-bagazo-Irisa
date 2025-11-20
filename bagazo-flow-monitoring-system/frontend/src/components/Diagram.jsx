import '../styles/Diagram.css';

export default function Diagram({ puntos, onPuntoClick }) {
  const getColorClass = (color) => {
    const colorMap = {
      red: '#ef4444',
      green: '#22c55e',
      yellow: '#eab308',
      blue: '#3b82f6'
    };
    return colorMap[color] || '#ef4444';
  };

  const handlePuntoClick = (punto) => {
    onPuntoClick(punto);
  };

  return (
    <div className="diagram-container">
      <h2 className="diagram-title">Sistema de Monitoreo - Conductores de Bagazo </h2>
      
      <div className="diagram-content">
        {/* Imagen del conductor */}
        <div className="diagram-image-wrapper">
          <img 
            src="/conductor-bagazo.jpg" 
            alt="Conductor de Bagazo" 
            className="diagram-image"
          />
        </div>

        {/* Leyenda - Botones clickeables */}
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

      <p className="diagram-hint">💡 Haz clic en cualquier cuadro para ver la información completa del punto</p>
    </div>
  );
}