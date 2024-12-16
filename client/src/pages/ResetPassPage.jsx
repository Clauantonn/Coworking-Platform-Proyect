import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

const ResetPassPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { recoverPassCode } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${VITE_API_URL}/api/users/password/reset/${recoverPassCode}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword, repeatNewPassword }),
        }
      );

      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }

      toast.success('Contraseña restablecida correctamente');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='recover-pass-container'>
      <div className='recover-pass-form'>
        <img src='/Logo-limpio.png' alt='Logo' className='recover-pass-logo' />
        <form onSubmit={handleSubmit}>
          <h2>Restablecer Contraseña</h2>
          <label htmlFor='newPassword'>Nueva contraseña:</label>
          <input
            type='password'
            id='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor='repeatNewPassword'>Repetir nueva contraseña:</label>
          <input
            type='password'
            id='repeatNewPassword'
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            required
          />
          <button type='submit' disabled={loading}>
            Restablecer contraseña
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassPage;
