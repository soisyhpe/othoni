import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const Header = () => {
  const { showErrorMessage } = useNotification();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleManagerClick = () => {
    showErrorMessage('This feature will be available soon.');
  };

  const handleAddServerClick = () => {
    showErrorMessage('This feature will be available soon.');
  };

  return (
    <header className='bg-custom-dark'>
      <div className='rounded-b-3xl border-b border-custom-border'>
        <nav className="mx-auto flex items-center justify-between p-6 lg:px-8 max-w-7xl" aria-label="Global">
          <div className="flex items-center">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">othoni</span>
              <img className="h-8 w-auto" src={require("../../othoni.svg").default} alt="" />
            </a>

            <button className="text-sm font-semibold leading-6 text-white rounded-lg border border-custom-dark ml-4 p-2 hover:bg-custom-darker hover:border hover:border-custom-border" onClick={handleHomeClick}>
              Home
            </button>
            <button className="text-sm font-semibold leading-6 text-white rounded-lg border border-custom-dark ml-4 p-2 hover:bg-custom-darker hover:border hover:border-custom-border" onClick={handleManagerClick}>
              Manager
            </button>
            <button className="text-sm font-semibold leading-6 text-white rounded-lg border border-custom-border p-2 ml-4 hover:bg-white hover:text-black" onClick={handleAddServerClick}>
              <FontAwesomeIcon className='pr-1' icon={icon({name: 'plus'})} />
              Add my server
            </button>
          </div>

          <div className="lg:flex lg:flex-1 lg:justify-end">
            <Link to='/auth' className="text-sm font-semibold leading-6 text-white" onClick={() => {navigate('/auth')}}>
              Log in / Sign up <span aria-hidden="true"><FontAwesomeIcon className='pr-1' icon={icon({name: 'arrow-right'})} /></span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
