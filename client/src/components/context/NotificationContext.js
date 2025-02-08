import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const showErrorMessage = (message) => {
    setErrorMessage(message);
  };

  const showInfoMessage = (message) => {
    setInfoMessage(message);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
  };

  const showWarningMessage = (message) => {
    setWarningMessage(message);
  };

  const hideNotification = () => {
    setErrorMessage('');
    setInfoMessage('');
    setSuccessMessage('');
    setWarningMessage('');
  };

  return (
    <NotificationContext.Provider
      value={{
        errorMessage,
        infoMessage,
        warningMessage,
        successMessage,
        showErrorMessage,
        showInfoMessage,
        showSuccessMessage,
        showWarningMessage,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
