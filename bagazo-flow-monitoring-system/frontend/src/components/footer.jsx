import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-text">
              © {currentYear} Sistema Conductores de Bagazo - IRISA S.A.S.
            </p>
            <p className="footer-subtitle">
              Sistema de Monitoreo - Conductores de Bagazo
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-credits">
          <p className="footer-credits-text">| 
            <a href="https://www.ingeniorisaralda.com/es/" className="footer-link"> IRISA S.A.S </a> | 
            <a href="#" className="footer-link"> Pereira, Risaralda </a>
          </p>
        </div>
      </div>
    </footer>
  );
}