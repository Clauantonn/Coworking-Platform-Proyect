// Importamos los hooks.
import { useEffect, useState, useContext } from "react";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el hook.
const useBookings = () => {
  // Declaramos una variable en el State que permita almacenar la info de la entrada.
  const [bookings, setBookings] = useState([]);
  const { authToken } = useContext(AuthContext);

  // Con la ayuda de "useEffect" hacemos un fetch al servidor para buscar los productos
  // cuando se monta el componente.
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Obtenemos la respuesta.
        const res = await fetch(`${VITE_API_URL}/api/list/booking`, {
          headers: {
            Authorization: authToken,
          },
        });

        // Obtenemos el body.
        const body = await res.json();

        // Establecemos los productos en el State.
        setBookings(body.data.bookings);
      } catch (err) {
        alert(err.message);
      }
    };

    // Llamamos a la función anterior.
    fetchBookings();
  }, [authToken]);

  // Retornamos las variables y funciones que nos interesan.
  return { bookings };
};

export default useBookings;
