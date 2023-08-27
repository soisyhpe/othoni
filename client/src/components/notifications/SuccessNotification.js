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
    className="absolute top-8 right-8 py-3 px-4 bg-green-800 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className='text-slate-50'>
          <h4 className="font-semibold">Success</h4>
          <p className="-mt-1">{successMessage}</p>
        </div>
        <button className="ml-2 pl-1.5 text-slate-50 flex items-center justify-center" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;