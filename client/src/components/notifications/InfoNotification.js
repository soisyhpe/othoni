import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const InfoNotification = () => {
  const { infoMessage, hideNotification } = useNotification();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (infoMessage && !isHovered) {
      const timeout = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [infoMessage, hideNotification, isHovered]);

  if (!infoMessage) {
    return null;
  }

  return (
    <div
    className="absolute top-8 right-8 py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-500  rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="mr-2 text-slate-50 flex items-center justify-center" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'circle-info' })} className="text-3xl" />
        </div>
        <div className='text-slate-50'>
          <p>{infoMessage}</p>
        </div>
        <button className="ml-2 pl-1.5 text-slate-50 flex items-center justify-center" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default InfoNotification;
