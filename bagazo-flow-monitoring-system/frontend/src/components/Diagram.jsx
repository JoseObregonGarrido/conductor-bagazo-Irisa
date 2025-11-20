// Importacion de estilos especificos para este componente
import '../styles/Diagram.css';

// Definicion del Componente Diagrama
// Recibe 'puntos' (la data a mostrar) y 'onPuntoClick' (funcion para manejar la seleccion)
export default function Diagram({ puntos, onPuntoClick }) {
  
  // Funcion auxiliar para mapear el nombre del color (ej: 'red') a su codigo hexadecimal
  const getColorClass = (color) => {
    // Mapa de colores predefinidos (usando colores Tailwind o similares)
    const colorMap = {
      red: '#ef4444',    // Rojo (Alerta)
      green: '#22c55e',  // Verde (Normal)
      yellow: '#eab308', // Amarillo (Advertencia)
      blue: '#3b82f6'    // Azul (Info/Neutro)
    };
    // Devuelve el color mapeado o Rojo por defecto si el color no es reconocido
    return colorMap[color] || '#ef4444';
  };

  // Renderizado del componente
  return (
    // Contenedor principal del diagrama
    <div className="diagram-container">
      <h2 className="diagram-title">Diagrama de Conductores de Bagazo</h2>
      <svg
        // Define el espacio de coordenadas para el SVG
        viewBox="0 0 800 400"
        className="diagram-svg"
        // Asegura que el SVG se escale bien sin distorsion
        preserveAspectRatio="xMidYMid meet"
      >
        
        {/* Linea principal del conductor (simulando la banda transportadora) */}
        <line x1="50" y1="200" x2="750" y2="200" stroke="#666" strokeWidth="3" />

        {/* Bloque: Representacion grafica de la Caldera ISGEC */}
        <g>
          {/* Rectangulo que simula la caldera */}
          <rect x="20" y="100" width="100" height="80" fill="#1e3a5f" stroke="#00d4ff" strokeWidth="2" rx="5" />
          {/* Texto de etiqueta de la caldera */}
          <text x="70" y="140" textAnchor="middle" fill="#00d4ff" fontSize="12" fontWeight="bold">
            CALDERA
          </text>
          <text x="70" y="160" textAnchor="middle" fill="#00d4ff" fontSize="11">
            ISGEC
          </text>
        </g>

        {/* Lineas conectoras (segmentos visuales que podrian indicar ramificaciones o puntos de muestreo) */}
        <line x1="120" y1="140" x2="150" y2="140" stroke="#999" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="180" y1="140" x2="210" y2="140" stroke="#999" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="240" y1="140" x2="270" y2="140" stroke="#999" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="300" y1="140" x2="330" y2="140" stroke="#999" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="360" y1="140" x2="390" y2="140" stroke="#999" strokeWidth="1" strokeDasharray="5,5" />

        {/* Mapeo y renderizado de los Puntos de control clickeables (Iteracion sobre la data) */}
        {puntos.map((punto) => {
          let cx, cy; // Coordenadas X e Y del circulo

          // Definicion de posiciones X fijas basadas en el ID del punto
          // Se usa para distribuir los puntos a lo largo del diagrama horizontalmente
          const xPositions = {
            12: 120, 11: 180, 10: 240, 4: 300, 5: 360,
            8: 420, 9: 480, 7: 540, 6: 600, 3: 660, 2: 710, 1: 760
          };

          // Definicion de posiciones Y fijas basadas en la "seccion" del punto
          // Se usa para colocar los puntos arriba (140) o abajo (260) de la linea principal (200)
          const yPositions = {
            1: 260, 2: 260, 3: 260, 4: 140, 5: 140,
            6: 260, 7: 260, 8: 260, 9: 260, 10: 140, 11: 140, 12: 140
          };

          // Asignacion de coordenadas al punto actual (usa 400, 200 como fallback)
          cx = xPositions[punto.id] || 400;
          cy = yPositions[punto.id] || 200;

          // Obtiene el codigo hexadecimal del color segun el estado del punto
          const color = getColorClass(punto.color);

          return (
            // Grupo SVG 'g' para agrupar el circulo y el texto. Es el elemento clickeable.
            <g 
              key={punto.id} // Clave unica para React
              onClick={() => onPuntoClick(punto)} // Manejador de click que envia la data del punto
              className="punto-clickeable" // Clase para estilos de hover (cursor pointer)
            >
              {/* Elemento circulo que representa el punto de medicion */}
              <circle
                cx={cx}
                cy={cy}
                r="20" // Radio del circulo
                fill={color} // Color dinamico segun el estado del punto
                opacity="0.8"
                className="punto-circle"
              />
              {/* Texto que muestra el ID del punto dentro del circulo */}
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle" // Centrado vertical y horizontal del texto
                fill="white"
                fontSize="16"
                fontWeight="bold"
                className="punto-text"
              >
                {punto.id}
              </text>
            </g>
          );
        })}

        {/* Bloque de Etiquetas de secciones generales del conductor */}
        <g>
          {/* Etiqueta central sobre la linea principal */}
          <text x="420" y="340" textAnchor="middle" fill="#0ea5e9" fontSize="14" fontWeight="bold">
            CONDUCTOR PRINCIPAL
          </text>
          {/* Etiqueta de la zona de inicio (Bagacera) */}
          <text x="200" y="380" textAnchor="middle" fill="#22c55e" fontSize="12">
            BAGACERA
          </text>
          {/* Etiqueta de la zona de destino (Molinos) */}
          <text x="700" y="380" textAnchor="middle" fill="#22c55e" fontSize="12">
            MOLINOS
          </text>
        </g>
      </svg>
      {/* Indicacion para el usuario */}
      <p className="diagram-hint">Haz clic en cualquier numero para ver los detalles</p>
    </div>
  );
}