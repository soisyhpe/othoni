import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const ErrorNotification = () => {
  const { errorMessage, hideNotification } = useNotification();

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [errorMessage, hideNotification]);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg shadow-md absolute backdrop-blur-sm top-8 right-8">
      <div className="flex items-center justify-between">
        <p className="text-red-700">{errorMessage}</p>
        <button className="ml-2 text-red-700" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
