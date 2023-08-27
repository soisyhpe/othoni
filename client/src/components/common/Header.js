import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';
import ActionButton from '../buttons/ActionButton';
import NavigationButton from '../buttons/NavigationButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const Header = () => {
  const { showErrorMessage } = useNotification();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');

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

            <NavigationButton onClick={handleHomeClick}>
              Home
            </NavigationButton>

            <NavigationButton onClick={handleManagerClick}>
              Manager
            </NavigationButton>

            <div className="ml-4 relative">
              <FontAwesomeIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' icon={icon({name: 'search'})} />
              <input
                className="bg-custom-dark border border-custom-border rounded-lg border border-custom-border p-2 pl-10 font-regular text-gray-400"
                type="text"
                placeholder="Search for a server"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:flex lg:flex-1 lg:justify-end">

            <ActionButton onClick={handleAddServerClick}>
              <FontAwesomeIcon className='pr-1' icon={icon({name: 'plus'})} />
              Add my server
            </ActionButton>

            <Link to='/auth' className="text-sm font-semibold leading-6 p-2 ml-4 text-slate-50" onClick={() => {navigate('/auth')}}>
              Log in / Sign up <span aria-hidden="true"><FontAwesomeIcon className='pr-1' icon={icon({name: 'arrow-right'})} /></span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
