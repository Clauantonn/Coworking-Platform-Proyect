import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

// importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const Home = () => {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate("/Register");
  };

  const handleCardClick = (workspace) => {
    navigate(`/office/list?workspace=${workspace}`);
  };

  return (
    <main>
      <div className="portada">
        <div className="portada-content">
          <h1>Bienvenidos a Innovaspace</h1>
          <p>Te acompañamos en todas tus maneras de trabajar.</p>
        </div>
      </div>

      <div className="mega">
        <div className="texts">
          <h2>Explora todas nuestras opciones</h2>
          <NavLink to="/office/list">Ver todas las opciones</NavLink>{" "}
        </div>

        <div className="container">
          <div className="art" onClick={() => handleCardClick("OFFICE")}>
            <img src="./oficina.jpg" alt="Oficinas Privadas" />
            <h3>Oficinas Privadas</h3>
            <p>
              Instálate en una oficina totalmente amueblada con acceso a
              servicios profesionales y salas de reuniones, además de
              complementos opcionales.
            </p>
          </div>

          <div className="art" onClick={() => handleCardClick("DESK")}>
            <img src="./escritorio-privado.jpg" alt="Escritorio Personal" />
            <h3>Escritorio Personal</h3>
            <p>
              Instálate en una oficina totalmente amueblada con acceso a
              servicios profesionales y salas de reuniones, además de
              complementos opcionales.
            </p>
          </div>
        </div>
      </div>

      <section className="section-1">
        <img src="./gente-oficina.jpg" alt="foto de gente chocando las manos" />
        <div className="text-section-1">
          <h2>Busca la oficina que más se adecue para ti.</h2>
          <p>
            Completa el formulario de registro a continuación y comienza a
            disfrutar de nuestros increíbles espacios de trabajo.
          </p>
          <button onClick={handleRegisterClick}>Regístrate</button>
        </div>
      </section>

      <section className="section-2">
        <div className="text-section-2">
          <h2>Espacios Flexibles y Productividad Óptima</h2>
          <p>
            Transforma tu oficina con espacios flexibles que fomentan la
            colaboración y aumentan la productividad. Adáptate rápidamente a los
            cambios y mejora el bienestar de tu equipo con áreas tranquilas y
            amenidades compartidas. ¡Haz de tu oficina un lugar donde todos
            quieran estar!
          </p>
        </div>
        <img
          src="gente-feliz.jpg"
          alt="mujer explicando a los hombres de sala"
        />
      </section>

      <section className="section-3">
        <img src="./section-3.jpg" alt="dos personas mirando un ordenador" />
        <div className="text-section-3">
          <h2>Impulsa tu Creatividad y Conexiones Profesionales</h2>
          <p>
            No solo ofrecemos un lugar para trabajar, sino que también
            fomentamos la creatividad y el networking. Rodearte de profesionales
            de diversas industrias puede inspirarte y abrirte a nuevas ideas.
            Además, organizamos eventos y talleres que te permiten ampliar tu
            red de contactos y aprender nuevas habilidades.
          </p>
        </div>
      </section>

      <section className="section-4">
        <div className="text-section-4">
          <h2>
            Contamos con la confianza de las principales empresas del Mundo
          </h2>
          <p>
            Desde trabajadores autónomos hasta empresas multinacionales, estamos
            ayudando a nuestros miembros a reimaginar la forma en la que
            trabajan.
          </p>
          <div className="link-container"></div>
        </div>
        <div className="logos">
          <img src="./microsoft.jpg" alt="logo de Microsoft" />
          <img src="./google.jpg" alt="logo de Google" />
          <img src="./netflix.jpg" alt="logo de Netflix" />
          <img src="./twitter.jpg" alt="logo de Twitter" />
        </div>
      </section>

      <section className="section-5">
        <h2 className="section-5-title">¿Quieres Publicar una Oficina?</h2>
        <p>
          Ponte en contacto con nosotros para poder publicar tu espacio de
          coworking.
        </p>
        <button
          className="contact-button"
          onClick={() =>
            (window.location.href = "mailto:admin@innovaspace.com")
          }
        >
          Contáctanos
        </button>
      </section>
    </main>
  );
};

export default Home;
