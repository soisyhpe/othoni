import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';
import Footer from '../components/common/Footer';

import Button from '../components/buttons/Button';

const ServerPage = () => {
  const { serverAddress } = useParams();

  return (
    <div className='bg-custom-dark bg-custom-dark text-white flex flex-col min-h-screen'>
      <Header />
      <Breadcrumb />

      <div className='bg-custom-dark flex-grow'>
        <div className='mx-auto lg:px-8 max-w-7xl grid md:grid-cols-2 gap-8'>
          {/* Utilisez le serverAddress pour personnaliser le contenu */}
          Contenu de la page pour le serveur {serverAddress}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServerPage;
