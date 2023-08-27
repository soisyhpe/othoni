import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const ErrorNotification = () => {
  const { errorMessage, hideNotification } = useNotification();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (errorMessage && !isHovered) {
      const timeout = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [errorMessage, hideNotification, isHovered]);

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      className="bg-red-500 bg-opacity-50 p-4 rounded-lg border border-red-700 shadow-md absolute backdrop-blur-sm top-8 right-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <p className="text-red-700">{errorMessage}</p>
        <button className="mt-0.5 ml-2 px-1.5 text-red-700" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
