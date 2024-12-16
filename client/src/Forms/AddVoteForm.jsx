import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

const AddVoteForm = ({ idBooking, onVoteSubmit }) => {
  const { authToken } = useContext(AuthContext);
  const [vote, setVote] = useState(5);
  const [comment, setComment] = useState('');

  const handleVoteEntry = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(
        `${VITE_API_URL}/api/bookings/${idBooking}/vote`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
          },
          body: JSON.stringify({
            vote: Number(vote),
            comment,
          }),
        }
      );

      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }

      onVoteSubmit(vote);
      toast.success(body.message, {
        id: 'Voto enviado con exito',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'entryDetails',
      });
    }
  };

  const handleClick = (value) => {
    setVote(value);
  };

  return (
    <form onSubmit={handleVoteEntry}>
      <label htmlFor='vote'></label>

      {/* Contenedor para las estrellas y el textarea */}
      <div className='text-area-container'>
        <div>
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <label key={index}>
                <input
                  type='radio'
                  name='rating'
                  value={starValue}
                  onClick={() => handleClick(starValue)}
                  style={{ display: 'none' }}
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='estrellitas'
                  fill={starValue <= vote ? '#FFD700' : '#e4e5e9'}
                  viewBox='0 0 24 24'
                  strokeWidth='1'
                  stroke='currentColor'
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 17.27l-6.18 3.73 1.64-7.03L2 8.24l7.19-.61L12 2l2.81 5.63 7.19.61-5.46 5.73 1.64 7.03z'
                  />
                </svg>
              </label>
            );
          })}
        </div>

        <textarea
          className='text-area'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Deja un comentario (opcional)'
        />
      </div>
      <button id='submit-vote-button' type='submit'>
        Enviar review
      </button>
    </form>
  );
};

AddVoteForm.propTypes = {
  idBooking: PropTypes.number.isRequired,
  onVoteSubmit: PropTypes.func.isRequired,
};

export default AddVoteForm;
