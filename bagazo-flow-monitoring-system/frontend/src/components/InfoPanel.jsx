import '../styles/InfoPanel.css';

export default function InfoPanel({ punto, onClose }) {
  if (!punto) {
    return (
      <div className="info-panel">
        <div className="info-empty">
          <div className="empty-icon"></div>
          <h3>Selecciona un Punto</h3>
          <p>Haz clic en cualquier número de la leyenda para ver los detalles del punto de control.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <div className="info-header">
        <div className="punto-badge" style={{ backgroundColor: getColorForState(punto.color) }}>
          {punto.id}
        </div>
        <div className="info-header-text">
          <h2 className="info-title">{punto.nombre}</h2>
          <p className="info-type">{punto.tipo}</p>
        </div>
        <button className="close-button" onClick={onClose} title="Cerrar">
          Cerrar
        </button>
      </div>

      <div className="info-content">
        <div className="model3d-wrapper">
          <Model3D />
        </div>
        
        <div className="info-section">
          <h4 className="section-title">Información General</h4>
          <div className="info-item">
            <span className="label">Ubicación:</span>
            <span className="value">{punto.ubicacion}</span>
          </div>
          <div className="info-item">
            <span className="label">Estado:</span>
            <span className={`value state-${punto.estado.toLowerCase().replace(' ', '-')}`}>
              {punto.estado}
            </span>
          </div>
        </div>

        <div className="info-section">
          <h4 className="section-title">Parámetros Operativos</h4>
          <div className="info-item">
            <span className="label">Caudal:</span>
            <span className="value">{punto.caudal}</span>
          </div>
          <div className="info-item">
            <span className="label">Presión:</span>
            <span className="value">{punto.presion}</span>
          </div>
          <div className="info-item">
            <span className="label">Temperatura:</span>
            <span className="value">{punto.temperatura}</span>
          </div>
          <div className="info-item">
            <span className="label">Velocidad:</span>
            <span className="value">{punto.velocidad}</span>
          </div>
        </div>

        <div className="info-status">
          <div className="status-indicator" style={{ backgroundColor: getColorForState(punto.color) }}></div>
          <p className="status-text">
            Punto {punto.id} - {punto.nombre}
          </p>
        </div>
      </div>
    </div>
  );
}

function getColorForState(color) {
  const colorMap = {
    red: '#DC3545',
    green: '#00A352',
    yellow: '#FF9800',
    blue: '#3b82f6'
  };
  return colorMap[color] || '#DC3545';
}