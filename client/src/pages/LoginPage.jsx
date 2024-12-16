// Importamos los hooks.
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const LoginPage = () => {
  // Importamos los datos del usuario y la función que almacena el token.
  const { authUser, authLogin } = useContext(AuthContext);

  // Importamos la función navigate.
  const navigate = useNavigate();

  // Declaramos una variable en el State para definir el valor de cada input.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Variable que indica cuando termina el fetch.
  const [loading, setLoading] = useState(false);

  // Función que maneje el envío del formulario.
  const handleLoginUser = async (e) => {
    try {
      // Prevenimos el comportamiento por defecto del formulario.
      e.preventDefault();

      // Indicamos que va a dar comienzo el fetch.
      setLoading(true);

      // Obtenemos una respuesta.
      const res = await fetch(`${VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Obtenemos el body.
      const body = await res.json();

      // Si hubo algún error lo lanzamos.
      if (body.status === "error") {
        throw new Error(body.message);
      }

      // Almacenamos el token en el State y en el localStorage.
      authLogin(body.data.token);
    } catch (err) {
      toast.error(err.message, {
        id: "login",
      });
    } finally {
      // Indicamos que ha finalizado el fetch.
      setLoading(false);
    }
  };

  // Si estamos logeados restringimos el acceso redirigiendo a la página principal.
  // En este caso utilizaremos el componente Navigate (en lugar de la función).
  if (authUser) {
    console.log("Login exitoso, redirigiendo a la página principal");
    return <Navigate to="/" />;
  }

  return (
    <main className="login-page">
      <div className="login-form-container">
        <img src="/Logo-limpio.png" alt="Logo" className="login-logo" />
        <h2>Inicio de Sesión</h2>

        <form className="login-form" onSubmit={handleLoginUser}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ingrese su email"
          />

          <label htmlFor="pass">Contraseña:</label>
          <input
            type="password"
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingrese su contraseña"
          />

          <p className="forgot-password">
            <a href="/users/password/recover">¿Has olvidado tu contraseña?</a>
          </p>

          <button className="login-button" disabled={loading}>
            Log In
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
