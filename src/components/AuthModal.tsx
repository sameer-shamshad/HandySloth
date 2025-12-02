import { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setIsLogin(true)} />
  );
};

export default AuthModal;