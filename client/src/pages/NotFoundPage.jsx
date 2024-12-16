import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="not-found-container">
      <div className="not-found-content">
        <h2>
          Lo sentimos, parece que no hemos podido encontrar la página
          solicitada!
        </h2>
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
      </div>
      <div className="not-found-image">
        <img src="/notfound.png" alt="Página no encontrada" />
      </div>
    </main>
  );
};

export default NotFoundPage;
