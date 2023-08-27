import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showErrorMessage = (message) => {
    setErrorMessage(message);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
  };

  const hideNotification = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <NotificationContext.Provider
      value={{
        errorMessage,
        successMessage,
        showErrorMessage,
        showSuccessMessage,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
