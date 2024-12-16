import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact-info">
          <p>+34 654837625</p>
          <p>
            Calle Goya 10,
            <br /> Salamanca,
            <br /> 28001,
            <br /> Madrid
          </p>
        </div>
        <div className="legal-links">
          <a href="#">Privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Cookies</a>
        </div>
      </div>
      <p className="copyright">
        &copy; 2024 Innovaspace Companies Inc. Todos los derechos reservados
      </p>
    </footer>
  );
};

export default Footer;
