// Importamos los hooks.
import useBookings from "../hooks/UseBookings";
import { useContext, useState, useEffect } from "react";

// Importamos los componentes.
import { NavLink, Navigate, useNavigate } from "react-router-dom";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la librería moment
import moment from "moment";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const BookingsListPage = () => {
  // Estado para controlar si se está cargando y si hay error.
  const [isLoading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(false);
  // Estado para gestionar el filtro de estado
  const [filterStatus, setFilterStatus] = useState("");
  // Obtenemos los bookings del hook
  const { bookings, setBookings } = useBookings();
  // Obtenemos el token y usuario autenticado
  const { authToken, authUser } = useContext(AuthContext);

  // Declaramos la funcion navigate
  const navigate = useNavigate();

  // Redirigimos al login si no hay sesion iniciada
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  // useEffect para cargar las reservas
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${VITE_API_URL}/api/list/booking`, {
          headers: {
            Authorization: authToken,
          },
        });

        const body = await res.json();

        if (body.status === "error") {
          throw new Error(body.message);
        }

        // Ordenamos las reservas por ID de forma descendente
        const sortedBookings = body.data.bookings.sort(
          (a, b) => b.idBooking - a.idBooking
        );
        setBookings(sortedBookings);
      } catch (err) {
        setError("Error al cargar las reservas");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Mientras se está cargando, mostramos un mensaje de carga.
  //  if (isLoading) {
  //   return (
  //      <main>
  //       <h1>Obteniendo reservas...</h1>
  //      <p>Por favor, espera un momento mientras procesamos tu solicitud.</p>
  //    </main>
  //  );
  // }

  // Si hay un error, mostramos un mensaje de error.
  if (error) {
    <main>
      <h1>Error al obtener las reservas</h1>
      <p>Intenta recargar la página o intenta de nuevo más tarde.</p>
      <p>ERROR: {error}</p>
    </main>;
  }

  // Función para gestionar el cambio de selección en el menú
  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };
  // Filtrar las reservas según el estado seleccionado
  const filteredBookings = filterStatus
    ? bookings.filter((booking) => booking.status === filterStatus)
    : bookings;

  const handleClikList = (path) => {
    navigate(path);
  };

  return (
    <main className="bookings-list-page">
      <h1 className="page-title">Listado de reservas</h1>

      <div className="filter-container">
        <div className="select-wrapper">
          <img src="/filter.png" alt="Filtrar" className="filter-icon" />
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={handleStatusChange}
          >
            <option value="">Todas</option>
            <option value="CONFIRMED">Confirmadas</option>
            <option value="CANCELED">Canceladas</option>
            <option value="PENDING">Pendientes</option>
            <option value="REJECTED">Rechazadas</option>
          </select>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <ul className="bookings-list">
          {filteredBookings.map((booking) => (
            <li
              key={booking.idBooking}
              className="booking-card"
              onClick={() =>
                handleClikList(`/users/bookings/${booking.idBooking}`)
              }
            >
              <div className="booking-image">
                {booking.photos && booking.photos.length > 0 ? (
                  <img
                    src={`${VITE_API_URL}/${booking.photos[0].name}`}
                    alt={`Foto ${booking.photos[0].name}`}
                    className="booking-photo"
                  />
                ) : (
                  <p>No hay fotos disponibles.</p>
                )}
              </div>
              <div className="booking-info">
                <h2>{booking.nameOffice}</h2>
                <ul>
                  <li>
                    Check In:{" "}
                    {moment(booking.checkIn).format("DD/MM/YYYY [a las] HH:mm")}
                  </li>
                  <li>
                    Check Out:{" "}
                    {moment(booking.checkOut).format(
                      "DD/MM/YYYY [a las] HH:mm"
                    )}
                  </li>
                  <li className="booking-status">
                    Estado de reserva: {booking.status}
                  </li>
                  <li>Precio: {booking.price} €</li>
                </ul>
                {authUser.role === "ADMIN" && (
                  <ul className="admin-info">
                    <li>Usuario: {booking.username}</li>
                    <li>
                      {booking.guests} Invitados / {booking.capacity} Capacidad
                    </li>
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-bookings-message">
          <p>
            No hay reservas disponibles. Haz click en el siguiente enlace para
            hacer una reserva:
          </p>
          <NavLink to="/office/list">
            Ver listado de oficinas disponibles
          </NavLink>
        </div>
      )}
    </main>
  );
};

export default BookingsListPage;
