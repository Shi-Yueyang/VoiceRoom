import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <>
      {isLogin ? (
        <LoginScreen onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterScreen onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default AuthScreen;
