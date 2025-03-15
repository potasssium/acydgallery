import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/loginPage.css';
import Login from './Login';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    if (onLogin) {
      onLogin(userData);
    }
    navigate('/account');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <Login onLogin={handleLogin} onClose={handleClose} />
      </div>
    </div>
  );
};

export default LoginPage; 