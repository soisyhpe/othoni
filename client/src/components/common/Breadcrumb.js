import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = () => {
  return (
    <div className='bg-custom-dark'>
      {/* Server cards */}
      <div className='mx-auto lg:py-4 lg:px-8 max-w-7xl'>
          <nav className="flex">
            <Link to="/" className="text-white">
              Home
            </Link>
            <span className="mx-2 text-white">/</span>
            <span className="text-gray-400">Servers</span>
          </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
