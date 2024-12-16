// Importamos los hooks.
import { useContext, useState } from "react";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";
import { Navigate, Link } from "react-router-dom";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const UserProfilePage = () => {
  // Importamos el token.
  const { authToken, authUser, authUpdateAvatarState, authUpdateUserState } =
    useContext(AuthContext);

  // Creamos una variable en el State por cada input.
  const [avatar, setAvatar] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  // Agregamos estados para los campos de perfil
  const [username, setUsername] = useState(authUser?.username || "");
  const [email, setEmail] = useState(authUser?.email || "");

  // Agregamos un nuevo estado para controlar la visibilidad del formulario
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Función que maneja el envío del formulario.
  const handleUpdateAvatar = async (e) => {
    try {
      // Prevenimos el comportamiento por defecto.
      e.preventDefault();

      // Creamos un objeto FormData.
      const formData = new FormData();

      // Agregamos los valores y propiedades.
      formData.append("avatar", avatar);

      // Obtenemos una respuesta del servidor.
      const res = await fetch(`${VITE_API_URL}/api/users/avatar`, {
        method: "PATCH",
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      // Obtenemos el body.
      const body = await res.json();

      // Si hay algún error lo lanzamos.
      if (body.status === "error") {
        throw new Error(body.message);
      }

      // Actualizamos la info del avatar en el State del usuario.
      authUpdateAvatarState(body.data.avatar);

      // Mostramos un mensaje satisfactorio al usuario.
      toast.success(body.message, {
        id: "userProfile",
      });
    } catch (err) {
      toast.error(err.message, {
        id: "userProfile",
      });
    }
  };

  // Función que maneja el cambio de contraseña.
  const handleChangePassword = async (e) => {
    try {
      e.preventDefault();

      if (newPassword !== repeatNewPassword) {
        throw new Error("Las nuevas contraseñas no coinciden");
      }

      const res = await fetch(`${VITE_API_URL}/api/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }

      toast.success(body.message, {
        id: "passwordChange",
      });

      setCurrentPassword("");
      setNewPassword("");
      setRepeatNewPassword("");
    } catch (err) {
      toast.error(err.message, {
        id: "passwordChange",
      });
    }
  };

  // Función para manejar el clic en la imagen del avatar
  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  // Función para manejar el cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  // Agregamos función para manejar la actualización del perfil
  const handleUpdateProfile = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(`${VITE_API_URL}/api/users/editProfile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }

      // Actualizamos el estado del usuario usando la nueva función
      authUpdateUserState({ username });

      toast.success(body.message, {
        id: "profileUpdate",
      });
    } catch (err) {
      toast.error(err.message, {
        id: "profileUpdate",
      });
    }
  };

  //Si no estamos logueados redirigimos a la página de login.
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="user-profile-page">
      <h2 className="profile-title">Hola, {authUser.username}</h2>

      <div className="avatar-update-container">
        <div className="avatar-container" onClick={handleAvatarClick}>
          {authUser.avatar ? (
            <img
              src={`${VITE_API_URL}/${authUser.avatar}`}
              alt={`foto de perfil de ${authUser.username}`}
              className="profile-image"
            />
          ) : (
            <img
              src="/default-avatar.png"
              alt={`foto de perfil de ${authUser.username}`}
              className="profile-image"
            />
          )}
          <input
            type="file"
            id="avatarInput"
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            style={{ display: "none" }}
          />
        </div>

        <form onSubmit={handleUpdateAvatar}>
          <button className="update-avatar-button">Guardar cambios</button>
        </form>
      </div>

      <form onSubmit={handleUpdateProfile} className="profile-update-form">
        <h3>Información del Perfil</h3>

        <label htmlFor="username">Nombre de usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          readOnly
          className="readonly-input"
        />

        <button>Guardar cambios</button>
      </form>

      <div className="password-section">
        <button
          type="button"
          className="toggle-password-form-button"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? "Cancelar" : "Modificar contraseña"}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={handleChangePassword}
            className="password-change-form"
          >
            <h3>Cambiar contraseña</h3>
            <label htmlFor="currentPassword">Contraseña actual:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Ingrese su contraseña actual"
            />

            <label htmlFor="newPassword">Nueva contraseña:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Ingrese su nueva contraseña"
            />

            <label htmlFor="repeatNewPassword">Repetir nueva contraseña:</label>
            <input
              type="password"
              id="repeatNewPassword"
              value={repeatNewPassword}
              onChange={(e) => setRepeatNewPassword(e.target.value)}
              required
              placeholder="Repita su nueva contraseña"
            />

            <button>Cambiar contraseña</button>
          </form>
        )}
      </div>
    </main>
  );
};

export default UserProfilePage;
