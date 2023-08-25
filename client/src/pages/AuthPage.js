import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/custom.css';

const AuthPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <div className="bg-custom-dark">
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-lg">
          <div className="bg-custom-dark border border-custom-border rounded-3xl shadow px-12 py-12 text-white">
            {showLoginForm ? <LoginForm /> : <RegisterForm />}
            
            <div className="mt-4 text-center">
              <span className="text-white">
                {showLoginForm ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button onClick={toggleForm} className="text-blue-600 hover:underline ml-1">
                {showLoginForm ? "Register here" : "Login here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
