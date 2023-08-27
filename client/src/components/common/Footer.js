import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

const Footer = () => {
  return (
    <footer className='bg-custom-dark'>
      <div className='rounded-t-3xl border-t border-custom-border'>
        <div className='mx-auto flex justify-between p-6 lg:px-8 max-w-7xl grid md:grid-cols-5 gap-8'>
          <div className='md:col-span-2'>
            <p className='text-sm'>othoni monitors and lists Minecraft: Java Edition servers.</p>
            <br/>
            <p className='text-sm text-white'>&copy; {new Date().getFullYear()} othoni. All rights reserved.</p>
          </div>

          <div className=''>
            <h4 className='text-base text-white font-semibold'>Useful Links</h4>
            <ul className='mt-2'>
              {/* <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Ranking</a></li> */}
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Home</a></li>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Manager</a></li>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Add my server</a></li>
            </ul>
          </div>

          <div className=''>
            <h4 className='text-base text-white font-semibold'>Community</h4>
            <ul className='mt-2'>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Discord</a></li>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Twitter</a></li>
            </ul>
          </div>
          
          <div className=''>
            <h4 className='text-base text-white font-semibold'>Developer</h4>
            <ul className='mt-2'>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>API Documentation</a></li>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>Server plugins</a></li>
              <li><a href='#' className='text-sm text-gray-300 hover:text-white'>GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
