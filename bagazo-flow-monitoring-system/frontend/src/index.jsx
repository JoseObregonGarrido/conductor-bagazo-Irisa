// Importa la librería React
import React from 'react'
// Importa ReactDOM para renderizar componentes en el navegador
import ReactDOM from 'react-dom/client'
// Importa el componente principal de la aplicación
import App from './App.jsx'
// Importa los estilos CSS globales
import './index.css'

// Obtiene el elemento HTML con id 'root' y renderiza la aplicación dentro de él
ReactDOM.createRoot(document.getElementById('root')).render(
    // React.StrictMode detecta problemas potenciales en la aplicación durante desarrollo
    <React.StrictMode>
        {/* Renderiza el componente App */}
        <App />
    </React.StrictMode>,
)