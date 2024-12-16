// Importamos los hooks.
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const ActivateUserPage = () => {
  // Importamos la función navigate.
  const navigate = useNavigate();

  // Obtenemos el código de registro de los path params.
  const { registrationCode } = useParams();

  // Estado para controlar si hay un error o si se está cargando.
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función que valida a un usuario en la base de datos.
    const fetchValidateUser = async () => {
      try {
        // Obtenemos una respuesta del servidor.
        const res = await fetch(
          `${VITE_API_URL}/api/users/activate/${registrationCode}`,
          {
            method: 'PATCH',
          }
        );

        // Traducimos el body.
        const body = await res.json();

        // Si la respuesta no es exitosa, lanzamos un error.
        if (!res.ok) {
          throw new Error(body.message || 'Error al activar la cuenta.');
        }

        // Mostramos un mensaje satisfactorio al usuario.
        toast.success(body.message || 'Cuenta activada con éxito', {
          id: 'validate',
        });

        // Redirigimos a login después de 5 segundos.
        setTimeout(() => {
          navigate('/login');
        }, 10000);
      } catch (err) {
        // En caso de error, mostramos el mensaje de error y actualizamos el estado.
        setHasError(true);
        toast.error(err.message, {
          id: 'validate',
        });
      } finally {
        // Indicamos que ha finalizado el proceso.
        setIsLoading(false);
      }
    };

    // Llamamos a la función de validación de usuario.
    fetchValidateUser();
  }, [registrationCode, navigate]);

  // Si hay un error, mostramos el mensaje de error en lugar del contenido normal.
  if (hasError) {
    return (
      <main className='main-not-active-user'>
        <div>
          <img
            src='/Soporte-tecnico.png'
            alt='imagen ilustrada de soporte tecnico'
          />
          <h1>No ha sido posible activar tu cuenta</h1>
          <p>
            Seguramente esta cuenta ya está activada o el enlace ha expirado.
            Por favor, si el problema persiste intenta nuevamente más tarde o
            contacta con soporte.
          </p>
          <a href='https://inovaspace.com/soporte'>
            Servicio Técnico Innovaspace
          </a>
        </div>
      </main>
    );
  }

  // Mientras se está cargando, mostramos un mensaje de carga.
  if (isLoading) {
    return (
      <main className='activate-isloading'>
        <h1>Activando tu nuevo perfil...</h1>
        <p>Por favor, espera un momento mientras procesamos tu solicitud.</p>
      </main>
    );
  }

  // Contenido mostrado cuando la activación es exitosa.
  return (
    <main className='main-not-active-user'>
      <div>
        <img src='/activateUser.png' alt='ilustracion de activando perfil' />
        <h1 id='exitoso'>Perfil activado con éxito</h1>
        <p>
          Serás redirigido a la página de inicio de sesión en unos segundos.
          Gracias por tu paciencia.
        </p>
        <p>Si lo prefieres, haz clic aquí: </p>
        <a href='/login'> Login</a>
      </div>
    </main>
  );
};

export default ActivateUserPage;
