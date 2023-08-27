import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const SuccessNotification = () => {
  const { successMessage, hideNotification } = useNotification();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (successMessage && !isHovered) {
      const timeout = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [successMessage, hideNotification, isHovered]);

  if (!successMessage) {
    return null;
  }

  return (
    <div
      className="bg-green-500 bg-opacity-50 p-4 rounded-lg border border-green-700 shadow-md absolute backdrop-blur-sm top-8 right-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <p className="text-green-700">{successMessage}</p>
        <button className="mt-0.5 ml-2 px-1.5 text-green-700" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} />
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
