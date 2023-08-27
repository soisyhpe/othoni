import React from 'react';
import CopyToClipboardButton from '../common/CopyToClipboardButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const Server = ({ server }) => {
  return (
    <div className='rounded-3xl border border-custom-border flex bg-custom-dark text-white'>
      <img className="rounded-l-3xl h-32 w-32" src={server.iconPath} alt={`${server.name} Icon`} />
      <div className='m-4 w-full relative flex flex-col justify-center'>
        <div className='flex items-center justify-between'>
          <div className='text-base font-semibold'>{server.name}</div>
          <span className='text-base font-regular text-white'>{server.playerCount}<span className='text-gray-500'>/{server.playerSlot}</span></span>
        </div>
        <div className='text-base font-regular'>
          <span className='cursor-pointer text-blue-500 hover:underline flex items-center'>
            <CopyToClipboardButton text={server.address} />
          </span>
        </div>
        <div className={`mt-2 ${server.serverLinks.length > 2 ? 'overflow-x-scroll' : ''}`}>
          <ul className='flex space-x-2'>
            {server.serverLinks.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href={link.url} className='text-sm rounded-3xl border py-0.5 px-2 text-gray-300 hover:text-black hover:bg-white'>
                  <FontAwesomeIcon className='pr-1' icon={icon({name: 'link'})} />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Server;
