import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const ErrorNotification = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  // const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000); // Ferme la notification automatiquement après 5 secondes

    // const interval = setInterval(() => {
      // setProgress((prevProgress) => prevProgress - 100 / 50); // Diminuer la barre de progression toutes les 100ms
    // }, 100);

    return () => {
      clearTimeout(timeout);
      // clearInterval(interval);
    };
  }, [onClose]);

  const handleCloseClick = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg shadow-md absolute backdrop-blur-sm top-8 right-8">
      <div className="flex items-center justify-between">
        <p className="text-red-700">{message}</p>
        <button className="ml-2 text-red-700" onClick={handleCloseClick}>
          <FontAwesomeIcon icon={icon({name: 'xmark'})} />
        </button>
      </div>
      {/*<div className="mt-2 h-2 bg-red-800 rounded overflow-hidden">
        <div className="h-full bg-red-700" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
      </div>*/}
    </div>
  );
};

ErrorNotification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorNotification;
