// // useOffice.js
// // Este archivo define un hook personalizado para obtener información de una oficina

// // Importamos los hooks useState y useEffect de React
// import { useState, useEffect } from 'react';

// // Obtenemos la URL de la API desde las variables de entorno
// const { VITE_API_URL } = import.meta.env;

// // Definimos el hook personalizado useOffice que toma un officeId como parámetro
// const useOffice = (idOffice) => {
//   // Declaramos un estado para almacenar la información de la oficina
//   const [office, setOffice] = useState(null);
//   // Declaramos un estado para controlar si la carga está en progreso
//   const [loading, setLoading] = useState(true);

//   // Utilizamos useEffect para realizar la petición a la API cuando cambie el officeId
//   useEffect(() => {
//     // Definimos una función asíncrona para obtener los datos de la oficina
//     const fetchOffice = async () => {
//       try {
//         // Realizamos la petición GET a la API
//         const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`);
//         // Convertimos la respuesta a JSON
//         const data = await res.json();
//         // Actualizamos el estado con la información de la oficina
//         setOffice(data.offices);
//       } catch (error) {
//         // Si hay un error, lo mostramos en la consola
//         console.error('Error fetching office:', error);
//       } finally {
//         // Independientemente del resultado, marcamos la carga como finalizada
//         setLoading(false);
//       }
//     };

//     // Llamamos a la función para obtener los datos
//     fetchOffice();
//   }, [idOffice]); // Este efecto se ejecutará cada vez que cambie el officeId

//   // Retornamos un objeto con la información de la oficina y el estado de carga
//   return { office, loading };
// };

// // Exportamos el hook para que pueda ser utilizado en otros componentes
// export default useOffice;
