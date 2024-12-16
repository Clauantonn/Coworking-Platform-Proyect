// register page by Alex

// importamos los hooks .

import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

//importamos el contexto

import { AuthContext } from "../contexts/AuthContext";

// importamos la funcion toast ( la que deja bonito los errores en pantalla)

import toast from "react-hot-toast";

// importamos la URL del servidor

const { VITE_API_URL } = import.meta.env;

// se inicia el componente

const RegisterPage = () => {
  // importamos datos del usuario
  const { authUser } = useContext(AuthContext);

  // importamos la funcion navigate.

  const navigate = useNavigate();

  // declaramos una variable en el State para definir el valor de cada input

  //  username, name, lastname, email, password

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // variable que indica cuando termina el fetch.
  const [loading, setLoading] = useState(false);

  // funcion que maneja el envio del form

  const handleRegisterUser = async (e) => {
    try {
      // prevenimos el comportamiento por defecto del formulario
      e.preventDefault();

      // Indicamos que va dar comienzo el fetch.

      setLoading(true);

      // obtenemos una respuesta.

      const res = await fetch(`${VITE_API_URL}/api/users/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          name,
          lastname,
          email,
          password,
        }),
      });
      // obtenemos el body.
      const body = await res.json();

      // si hubo algun error lo lanzamos.

      if (body.status === "error") {
        throw new Error(body.message);
      }
      // redirigimos a la pagina de login.
      navigate("/login");

      // si todo ha salido bien mostramos un mensaje
      toast.success(body.message, {
        id: "register",
      });
    } catch (err) {
      toast.error(err.message, {
        id: "register",
      });
    } finally {
      // indicamos que ha finalizado el fetch
      setLoading(false);
    }
  };
  // Si estamos logeados restringimos el acceso redirigiendo a la página principal.
  // En este caso utilizaremos el componente Navigate (en lugar de la función).
  if (authUser) {
    return <Navigate to="/" />;
  }

  return (
    <main className="register-page">
      <div className="register-form-container">
        <img src="/Logo-limpio.png" alt="Logo" className="register-logo" />
        <h2>Registro</h2>

        <form onSubmit={handleRegisterUser}>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingrese su nombre de usuario"
          />

          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ingrese su nombre"
          />

          <label htmlFor="lastname">Apellidos:</label>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            placeholder="Ingrese sus apellidos"
          />

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

          <button disabled={loading}>Registrarme</button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
