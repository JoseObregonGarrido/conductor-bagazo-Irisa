import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-text">
              © {currentYear} Sistema de Monitoreo - Conductores de Bagazo - IRISA S.A.S.
            </p>
            <p className="footer-subtitle">
              Sistema de Monitoreo - Conductores de Bagazo
            </p>
          </div>

          <div className="footer-license">
            <a 
              href="https://creativecommons.org/licenses/by-nc-nd/4.0/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0"
            >
              <img 
                src="https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png" 
                alt="CC BY-NC-ND 4.0 License" 
              />
            </a>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-credits">
          <p className="footer-credits-text">
            Desarrollado como Proyecto | 
            <a href="https://www.ingeniorisaralda.com/es/" className="footer-link"> IRISA S.A.S </a> | 
            <a href="#" className="footer-link"> Pereira, Risaralda </a>
          </p>
        </div>
      </div>
    </footer>
  );
}