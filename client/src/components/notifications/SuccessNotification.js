import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const SuccessNotification = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timeout);
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
    <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg shadow-md absolute backdrop-blur-sm top-8 right-8">
      <div className="flex items-center justify-between">
        <p className="text-green-700">{message}</p>
        <button className="ml-2 text-green-700" onClick={handleCloseClick}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} />
        </button>
      </div>
    </div>
  );
};

SuccessNotification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SuccessNotification;
