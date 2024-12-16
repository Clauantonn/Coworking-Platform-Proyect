// Importamos los hooks useState y useEffect de React
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Obtenemos la URL de la API desde las variables de entorno
const { VITE_API_URL } = import.meta.env;

const useAnOffice = (idOffice) => {
  const [oficina, setOficina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOficina = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`);
        // Obtenemos el body.
        const body = await res.json();

        if (body.status === 'error') {
          throw new Error(body.message);
        }

        setOficina(body.data.offices);
      } catch (err) {
        toast.error(err.message, {
          id: 'officeDetails',
        });
      } finally {
        // Esta línea se ejecutará siempre, ya sea que haya un error o no.
        setLoading(false);
      }
    };

    // Llamamos a la función anterior.
    fetchOficina();
  }, [idOffice]);

  return {
    oficina,
    loading,
  };
};

export default useAnOffice;
