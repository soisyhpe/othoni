import React from 'react';

const Button = ({ type, onClick, children, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-700 text-slate-50 rounded-lg h-14 w-full mt-4 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
