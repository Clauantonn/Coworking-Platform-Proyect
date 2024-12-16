import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

const { VITE_API_URL } = import.meta.env;

const useUser = () => {
  const { authToken } = useContext(AuthContext);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/users/profile`, {
          headers: {
            Authorization: authToken,
          },
        });

        const body = await res.json();

        if (body.status === 'error') {
          throw new Error(body.message);
        }

        setUser(body.data.user);
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (authToken) {
      fetchUser();
    }
  }, [authToken]);

  return { user, setUser };
};
export default useUser;
