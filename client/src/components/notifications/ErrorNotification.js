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
      className="absolute top-8 right-8 py-3 px-4 bg-red-800 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className='text-slate-50'>
          <h4 className="font-semibold">Error</h4>
          <p className="-mt-1">{errorMessage}</p>
        </div>
        <button className="ml-2 pl-1.5 text-slate-50 flex items-center justify-center" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
