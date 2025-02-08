import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

  return (
    <div className='bg-custom-dark'>
      <div className='mx-auto lg:py-4 lg:px-8 max-w-7xl'>
        <nav className="flex">
          <Link to="/" className="text-white">
            Home
          </Link>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <span className="mx-2 text-white">/</span>
              <Link to={`/${segment}`} className="text-white">
                {segment}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
