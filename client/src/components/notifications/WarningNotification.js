import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const WarningNotification = () => {
  const { warningMessage, hideNotification } = useNotification();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (warningMessage && !isHovered) {
      const timeout = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [warningMessage, hideNotification, isHovered]);

  if (!warningMessage) {
    return null;
  }

  return (
    <div
      className="bg-orange-500 p-4 rounded-lg border border-orange-700 shadow-md absolute backdrop-blur-sm top-8 right-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className='text-orange-800'>
          <h4 className="font-semibold">Warning</h4>
          <p className="">{warningMessage}</p>
        </div>
        <button className="mt-0.5 ml-2 px-1.5 text-orange-900 flex items-center justify-center" onClick={hideNotification}>
          <FontAwesomeIcon icon={icon({ name: 'xmark' })} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default WarningNotification;
