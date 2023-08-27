import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const showErrorMessage = (message) => {
    setErrorMessage(message);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
  };

  const showWarningMessage = (message) => {
    setWarningMessage(message);
  };

  const hideNotification = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setWarningMessage('');
  };

  return (
    <NotificationContext.Provider
      value={{
        errorMessage,
        warningMessage,
        successMessage,
        showErrorMessage,
        showSuccessMessage,
        showWarningMessage,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
