// Importamos los hooks.
import { useEffect, useState } from 'react';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el hook.
const useSingleOffice = (idOffice) => {
  // Declaramos una variable en el State que permita almacenar la info de la oficina.
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtenemos la oficina cuando se monta el componente.
  useEffect(() => {
    // Solicitamos la oficina al servidor.
    const fetchOffice = async () => {
      try {
        // Obtenemos una respuesta del servidor.
        const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`);

        // Obtenemos el body.
        const body = await res.json();

        // Si hay algún error lo lanzamos.
        if (body.status === 'error') {
          throw new Error(body.message);
        }

        console.log('body que llega al UsesingleOffice', body.data); // Aquí revisamos qué estructura tiene la respuesta

        // Almacenamos la oficina.
        setOffice(body.data.offices);
      } catch (err) {
        toast.error(err.message, {
          id: 'OfficeDetails',
        });
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función anterior.
    fetchOffice();
  }, [idOffice]);

  // Retornamos las variables y funciones necesarias.
  return {
    office,
    loading,
  };
};

export default useSingleOffice;
