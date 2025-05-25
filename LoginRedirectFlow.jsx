
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRedirectFlow({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const missingRace = !user.race;
    const missingAppearance = !user.appearance || Object.keys(user.appearance).length === 0;

    if (missingRace || missingAppearance) {
      navigate('/create-character');
    } else {
      navigate('/home');
    }
  }, [user, navigate]);

  return null; // no UI
}
