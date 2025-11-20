// Importaciones esenciales de React
import { useState, useEffect } from 'react'; // Hook para manejar el estado y efectos secundarios en el componente.

// Importacion de Componentes de la interfaz de usuario
import Header from './components/Header'; // Componente de cabecera de la aplicacion.
import Diagram from './components/Diagram'; // Componente para mostrar el diagrama o mapa de puntos.
import InfoPanel from './components/InfoPanel'; // Componente para mostrar la informacion detallada del punto seleccionado.

// Importacion de Funciones de Servicio (Logica de Backend/API)
import { obtenerPuntos, verificarBackend } from './services/api'; // Funciones para interactuar con la API (obtener datos y chequear conexion).

// Importacion de estilos CSS
import './App.css'; // Archivo de estilos principal para la aplicacion.

// Definicion del Componente Principal de la Aplicacion (App)
export default function App() {
  // 1. Bloque de manejo de Estado (useState)

  // Estado para almacenar la lista de puntos obtenida del backend.
  const [puntos, setPuntos] = useState([]);
  // Estado para guardar el punto seleccionado actualmente por el usuario en el diagrama.
  const [puntosSeleccionado, setPuntosSeleccionado] = useState(null);
  // Estado booleano para indicar si la aplicacion esta cargando datos (muestra un spinner).
  const [cargando, setCargando] = useState(true);
  // Estado para guardar un mensaje de error si la conexion con el backend falla.
  const [error, setError] = useState(null);

  // 2. Bloque de Efectos Secundarios (useEffect)
  // Este hook se ejecuta una sola vez despues del primer renderizado ([]) para cargar los datos.
  useEffect(() => {
    // Funcion asincrona para manejar la logica de carga de datos y verificacion de la API.
    const cargarDatos = async () => {
      try {
        // Verificar si el backend esta disponible antes de intentar obtener datos
        await verificarBackend(); 
        
        // Cargar los puntos del backend
        const datos = await obtenerPuntos();
        // Actualiza el estado con los datos obtenidos
        setPuntos(datos);
        // Borra cualquier error previo si la carga fue exitosa
        setError(null);
      } catch (err) {
        // Manejo de errores: Si falla la conexion o la obtencion de datos
        console.error('Error al cargar datos:', err);
        // Establece un mensaje de error para mostrar al usuario
        setError('No se pudo conectar con el backend. Asegurate de que este ejecutandose en el puerto 5000.');
      } finally {
        // Se ejecuta siempre, independientemente del resultado, para detener el estado de carga
        setCargando(false);
      }
    };

    // Llama a la funcion de carga de datos al montar el componente
    cargarDatos();
  }, []); // El array vacio [] asegura que se ejecute solo una vez al inicio (simulando componentDidMount).

  // 3. Manejador de Eventos
  // Funcion que se pasa al componente Diagrama para actualizar el punto seleccionado al hacer click.
  const handlePuntoSeleccionado = (punto) => {
    setPuntosSeleccionado(punto);
  };

  // 4. Renderizado Condicional: Estado de Carga
  // Muestra un indicador de carga mientras 'cargando' sea true.
  if (cargando) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        </main>
      </div>
    );
  }

  // 5. Renderizado Condicional: Estado de Error
  // Muestra un mensaje de error si la variable 'error' contiene un valor.
  if (error) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="error">
            <h2>⚠️ Error de Conexion</h2>
            <p>{error}</p>
            {/* Boton para forzar el reinicio de la pagina y reintentar la carga */}
            <button onClick={() => window.location.reload()}>
              Intentar de nuevo
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 6. Renderizado Principal: Contenido de la Aplicacion (Si no hay carga ni error)
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="content-grid">
          <div className="diagram-section">
            {/* Renderiza el Diagrama solo si hay puntos para mostrar */}
            {puntos.length > 0 ? (
              <Diagram 
                puntos={puntos} // Prop: Puntos a dibujar en el diagrama
                onPuntoClick={handlePuntoSeleccionado} // Prop: Funcion a llamar al hacer click en un punto
              />
            ) : (
              // Mensaje si no se obtuvieron datos del backend
              <p className="no-data">No hay datos disponibles</p>
            )}
          </div>
          <div className="info-section">
            {/* Panel para mostrar detalles del punto seleccionado */}
            <InfoPanel punto={puntosSeleccionado} />
          </div>
        </div>
      </main>
    </div>
  );
}