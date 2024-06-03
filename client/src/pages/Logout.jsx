import React, { useState, useEffect } from 'react';
import '../styles/Logout.css';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    if (countdown === 0) {
      localStorage.removeItem('auth');
      navigate('/');
    }

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="logout-main">
      <h1>Logout Successful!</h1>
      <p>Redirecting to Login page in {countdown} sec...</p>
    </div>
  );
};

export default Logout;
