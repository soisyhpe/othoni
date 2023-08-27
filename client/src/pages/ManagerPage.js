import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/custom.css';

const ManagerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    console.log(authToken);
    
    if (!authToken) {
      navigate('/auth');
    } else {
      const expirationDate = new Date(Cookies.get('authTokenExpires')); // Remplacez 'authTokenExpires' par la clé utilisée pour stocker l'expiration du token
      const currentTime = new Date();

      console.log(expirationDate);
      
      if (expirationDate && expirationDate < currentTime) {
        navigate('/auth');
      }
    }
  }, [navigate]);

  return (
    <div className='bg-custom-dark'>
      <div className='flex justify-left flex-column h-screen'>
        <div className='relative bg-custom-dark text-base text-white rounded-r-3xl shadow border border-custom-border h-screen w-96'>
          <div className='mt-8'>
            <ul>
              <li className="fixed top-0 cursor-pointer text-center">
                Revenir sur le site
              </li>
              <li className='cursor-pointer text-left mx-4 my-1 py-2 px-4 border border-custom-dark rounded-lg hover:border hover:border-custom-border hover:bg-custom-darker'>
                <FontAwesomeIcon icon={icon({name: 'home'})} /> Home
              </li>
              <li className="fixed bottom-0 cursor-pointer text-center">
                Déconnexion
              </li>
            </ul>
          </div>
        </div>
      
        <div className='h-full w-full'>
          <p className='text-base text-white'>Home</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
