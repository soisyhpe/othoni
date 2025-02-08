import React from 'react';

const NavigationButton = ({ type, onClick, children, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-sm font-semibold leading-6 text-slate-50 rounded-lg border border-custom-border p-2 ml-4 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default NavigationButton;
