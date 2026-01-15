import '../styles/Header.css';

// Componente funcional que representa el encabezado de la aplicacion
export default function Header() {
    return (
        // Elemento header principal con clase CSS para estilos
        <header className="header">
            {/* Contenedor principal del encabezado */}
            <div className="header-container">
                {/* Sección de contenido: titulo y subtitulo */}
                <div className="header-content">
                    {/* Título principal de la aplicacion */}
                    <h1 className="header-title">Sistema De Visualización Interactiva  De Conductores De Bagazo</h1>
                    {/* Subtítulo descriptivo del sistema */}
                    <p className="header-subtitle">Sistema de  Visualización Interactiva De Conductores De Bagazo</p>
                </div>
                {/* Sección de informacion: badges con datos de la empresa */}
                <div className="header-info">
                    {/* Badge con el nombre de la empresa */}
                    <span className="badge">IRISA S.A.S.</span>
                </div>
            </div>
        </header>
    );
}