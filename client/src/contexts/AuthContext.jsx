import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const { VITE_AUTH_TOKEN, VITE_API_URL } = import.meta.env;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem(VITE_AUTH_TOKEN) || null
  );

  const [authUser, setAuthUser] = useState(
    localStorage.getItem("AuthUser") || null
  );

  // Declaramos una variable que indica que el fetch a los datos
  // del usuario no ha terminado. Util para activacion de usuario por ejemplo.
  const [authUserLoading, setAuthUserLoading] = useState(true);

  // Obtenemos los datos del usuario si existe un token.
  useEffect(() => {
    // Función que solicita los datos del usuario.
    const fetchUser = async () => {
      try {
        // Obtenemos la respuesta del servidor.
        const res = await fetch(`${VITE_API_URL}/api/users/profile`, {
          headers: {
            Authorization: authToken,
          },
        });

        // Obtenemos el body.
        const body = await res.json();

        // Si hay algún error lo lanzamos.
        if (body.status === "error") {
          throw new Error(body.message);
        }

        // Actualizamos los datos del usuario en el State.
        setAuthUser(body.data.user);
        localStorage.setItem("AuthUser", JSON.stringify(body.data.user));
      } catch (err) {
        // Si surge cualquier error eliminamos el token del State y del localStorage.
        authLogout();
        toast.error(err.message);
      } finally {
        // Indicamos que el fetch a los datos del usuario ha terminado.
        setAuthUserLoading(false);
      }
    };

    // Llamamos a la función anterior si existe un token.
    if (authToken) {
      fetchUser();
    } else {
      setAuthUser(null);
      setAuthUserLoading(false); // Indicamos que ya no está cargando
    }
  }, [authToken]);

  const authLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem(VITE_AUTH_TOKEN, token);
  };

  const authLogout = () => {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem(VITE_AUTH_TOKEN);
  };

  // Función que actualiza el avatar del usuario.
  const authUpdateAvatarState = (avatar) => {
    setAuthUser({
      ...authUser,
      avatar,
    });
  };

  // Función que actualiza los datos del usuario
  const authUpdateUserState = (userData) => {
    const updatedUser = {
      ...authUser,
      ...userData,
    };
    setAuthUser(updatedUser);
    localStorage.setItem("AuthUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        authLogin,
        authLogout,
        authUser,
        authUpdateAvatarState,
        authUpdateUserState,
        authUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
