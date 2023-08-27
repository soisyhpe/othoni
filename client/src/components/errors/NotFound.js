import React from 'react';
import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="bg-custom border border-custom-border rounded-3xl shadow px-12 py-12 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
        
        <p className="text-base mt-2">The page at {location.pathname} does not exist.</p>

        <div className="mt-4 text-center">
              <span className="text-white">
                Wrong way?
              </span>
              <button className="text-blue-600 hover:underline ml-1">
                Back to home
              </button>
            </div>
      </div>
    </div>
  );
};

export default NotFound;
