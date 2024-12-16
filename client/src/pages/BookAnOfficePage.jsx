import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import useAnOffice from '../hooks/useAnOffice';

const { VITE_API_URL } = import.meta.env;

const BookAnOfficePage = () => {
  const { authUser, authToken } = useContext(AuthContext);
  const { idOffice } = useParams();
  const { oficina, officeloading } = useAnOffice(idOffice);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('8');
  const [checkOutTime, setCheckOutTime] = useState('9');
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (checkInDate) {
      calcularPrecio();
    }
  }, [checkInDate, checkInTime, checkOutTime]);

  if (officeloading) {
    return <div>Cargando oficina...</div>;
  }

  if (!oficina) {
    return <div>No se encontraron los datos de la oficina.</div>;
  }

  const open = parseInt(oficina.opening);
  const close = parseInt(oficina.closing);
  const horasAbierto = close - open;

  const calcularPrecio = () => {
    const precioPorHora = parseFloat(oficina.price);

    if (isNaN(precioPorHora)) {
      console.error('El precio por hora es inválido');
      setTotalPrice(0);
      return;
    }

    const horaCheckIn = parseInt(checkInTime);
    const horaCheckOut = parseInt(checkOutTime);
    const horasReservadas = horaCheckOut - horaCheckIn;
    const precioTotal = horasReservadas * precioPorHora;

    setTotalPrice(horaCheckOut > horaCheckIn ? precioTotal : 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!authUser) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const checkIn = `${checkInDate}T${checkInTime.padStart(2, '0')}:00:00`;
      const checkOut = `${checkInDate}T${checkOutTime.padStart(2, '0')}:00:00`;

      const res = await fetch(`${VITE_API_URL}/api/booking/${idOffice}`, {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
          price: totalPrice,
        }),
      });

      const body = await res.json();
      if (body.status === 'error') throw new Error(body.message);

      navigate('/booking/list');
      toast.success(body.message, { id: 'newBooking' });
    } catch (err) {
      toast.error(err.message, { id: 'newBooking' });
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <main className='book-an-office-main'>
      <div className='book-an-office-title-container'>
        <h1 className='book-an-office-title'>Indica los datos de tu reserva</h1>
      </div>

      <div className='book-an-office-form-container'>
        <form onSubmit={handleSubmit} className='book-an-office-form'>
          <ul>
            <li>
              <label htmlFor='checkInDate'>Fecha de reserva:</label>
              <div className='date-input-container'>
                <input
                  type='date'
                  id='checkInDate'
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
                <img
                  src='/calendar.png'
                  alt='Calendario'
                  className='calendar-icon'
                />
              </div>
            </li>
            <li>
              <label htmlFor='checkInTime'>Check In - Hora:</label>
              <div className='select-container'>
                <select
                  id='checkInTime'
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  required
                >
                  {Array.from({ length: horasAbierto }, (_, i) => i + open).map(
                    (hour) => (
                      <option key={hour} value={hour}>{`${hour}:00h`}</option>
                    )
                  )}
                </select>
                <img
                  src='/arrowdown.png'
                  alt='Flecha abajo'
                  className='select-icon'
                />
              </div>
            </li>
            <li>
              <label htmlFor='checkOutTime'>Check Out - Hora:</label>
              <div className='select-container'>
                <select
                  id='checkOutTime'
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  required
                >
                  {Array.from(
                    { length: horasAbierto + 1 },
                    (_, i) => i + open
                  ).map((hour) => (
                    <option key={hour} value={hour}>{`${hour}:00h`}</option>
                  ))}
                </select>
                <img
                  src='/arrowdown.png'
                  alt='Flecha abajo'
                  className='select-icon'
                />
              </div>
            </li>
            <li>
              <label htmlFor='guests'>Número de invitados:</label>
              <input
                type='number'
                id='guests'
                name='guests'
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min='1'
                required
              />
            </li>
          </ul>
          <div className='book-an-office-price'>
            <strong>Precio total: {totalPrice.toFixed(2)} €</strong>
          </div>
          <div className='book-an-office-button-container'>
            <button type='submit' disabled={loading}>
              {loading ? 'Reservando...' : 'Reservar'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default BookAnOfficePage;
