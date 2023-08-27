import React from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import NotFound from '../components/errors/NotFound';

import Button from '../components/common/Button';

const HomePage = () => {
  const location = useLocation();

  return (
    <div className='bg-custom-dark bg-custom-dark text-white flex flex-col min-h-screen'>

      {/* Header */}
      <Header/>

      {/* Content */}
      <div className="bg-custom-dark flex-grow flex items-center justify-center">
        <div className="w-full max-w-lg">
          <NotFound/>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;
