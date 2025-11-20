// Importacion de estilos especificos para este componente
import '../styles/InfoPanel.css';

// Definicion del Componente InfoPanel
// Recibe 'punto' (el objeto con la data del punto seleccionado, o null)
export default function InfoPanel({ punto }) {
  
  // 1. Renderizado Condicional: Estado Vacio
  // Si no se ha seleccionado ningun punto (punto es null o undefined), muestra un mensaje de espera.
  if (!punto) {
    return (
      <div className="info-panel">
        <div className="info-empty">
          <div className="empty-icon">📍</div>
          <h3>Selecciona un Punto</h3>
          <p>Haz clic en cualquier numero del diagrama para ver los detalles del punto de control.</p>
        </div>
      </div>
    );
  }

  // 2. Renderizado del Panel de Informacion (si hay un punto seleccionado)
  return (
    <div className="info-panel">
      {/* Cabecera del Panel de Informacion */}
      <div className="info-header">
        {/* Etiqueta del ID del punto con color de fondo dinamico */}
        <div 
          className="punto-badge" 
          style={{ backgroundColor: getColorForState(punto.color) }} // Usa el color del estado del punto
        >
          {punto.id}
        </div>
        {/* Nombre y Tipo del Punto */}
        <div className="info-header-text">
          <h2 className="info-title">{punto.nombre}</h2>
          <p className="info-type">{punto.tipo}</p>
        </div>
      </div>

      {/* Contenido Detallado del Punto */}
      <div className="info-content">
        
        {/* Seccion 1: Informacion General */}
        <div className="info-section">
          <h4 className="section-title">Informacion General</h4>
          <div className="info-item">
            <span className="label">Ubicacion:</span>
            <span className="value">{punto.ubicacion}</span>
          </div>
          <div className="info-item">
            <span className="label">Estado:</span>
            {/* El estado tiene una clase dinamica para estilos especificos (ej: state-alerta) */}
            <span className={`value state-${punto.estado.toLowerCase().replace(' ', '-')}`}>
              {punto.estado}
            </span>
          </div>
        </div>

        {/* Seccion 2: Parametros Operativos */}
        <div className="info-section">
          <h4 className="section-title">Parametros Operativos</h4>
          {/* Muestra los distintos parametros reportados por el punto */}
          <div className="info-item">
            <span className="label">Caudal:</span>
            <span className="value">{punto.caudal}</span>
          </div>
          <div className="info-item">
            <span className="label">Presion:</span>
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

        {/* Indicador de estado al pie del panel */}
        <div className="info-status">
          {/* Circulo de color que indica el estado actual */}
          <div 
            className="status-indicator" 
            style={{ backgroundColor: getColorForState(punto.color) }}
          ></div>
          <p className="status-text">
            Punto {punto.id} - {punto.nombre}
          </p>
        </div>
      </div>
    </div>
  );
}

// Funcion auxiliar para mapear el nombre del color (ej: 'red') a su codigo hexadecimal
// (Esta funcion podria estar centralizada, pero se repite aqui para autonomia del componente)
function getColorForState(color) {
  const colorMap = {
    red: '#ef4444',    // Rojo para estados criticos/alerta
    green: '#22c55e',  // Verde para estados normales/operativos
    yellow: '#eab308', // Amarillo para advertencias
  };
  // Devuelve el codigo hexadecimal o Rojo por defecto
  return colorMap[color] || '#ef4444';
}