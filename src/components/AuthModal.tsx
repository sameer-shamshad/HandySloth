import { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AuthModal = () => {
  const [isRegister, setIsRegister] = useState(false);

  if (isRegister) {
    return <Register onSwitchToLogin={() => setIsRegister(false)} />;
  }

  return <Login onSwitchToRegister={() => setIsRegister(true)} />;
};

export default AuthModal;