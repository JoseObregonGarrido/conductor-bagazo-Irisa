import '../styles/Header.css';

// Componente funcional que representa el encabezado de la aplicación
export default function Header() {
    return (
        // Elemento header principal con clase CSS para estilos
        <header className="header">
            {/* Contenedor principal del encabezado */}
            <div className="header-container">
                {/* Sección de contenido: título y subtítulo */}
                <div className="header-content">
                    {/* Título principal de la aplicación */}
                    <h1 className="header-title">Bagazo Flow Monitoring System</h1>
                    {/* Subtítulo descriptivo del sistema */}
                    <p className="header-subtitle">Sistema de Conductores de Bagazo ISGEC</p>
                </div>
                {/* Sección de información: badges con datos de la empresa */}
                <div className="header-info">
                    {/* Badge con el nombre de la empresa */}
                    <span className="badge">IRISA S.A.S.</span>
                    {/* Badge secundario con la ubicación */}
                    <span className="badge badge-secondary">La virginia</span>
                </div>
            </div>
        </header>
    );
}