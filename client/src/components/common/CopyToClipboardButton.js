import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const CopyToClipboardButton = ({ text }) => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopyClick = () => {
    setShowTooltip(true);
    setShowCopiedMessage(true);
    setTimeout(() => {
      // setShowTooltip(false);
      setShowCopiedMessage(false);
    }, 1000);
  };

  return (
    <CopyToClipboard text={text}>
      <span
        onClick={handleCopyClick}
        className='cursor-pointer text-blue-500 hover:underline flex items-center'
      >
        <span
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className='relative'
        >
          {text}
          {showTooltip && (
            <div className='absolute top-0 left-full border border-custom-border bg-white ml-2 px-2 w-max text-base text-black rounded-lg'>
              {showCopiedMessage ? (
                <span>Copied to clipboard!</span>
              ) : (
                <span>
                  <FontAwesomeIcon className='pr-1' icon={icon({name: 'copy'})} />
                  Click to copy
                </span>
              )}
            </div>
          )}
        </span>
      </span>
    </CopyToClipboard>
  );
};

export default CopyToClipboardButton;
