import React from 'react';

const NavigationButton = ({ type, onClick, children, active, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-sm font-semibold leading-6 text-slate-50 rounded-lg border border-custom-dark ml-4 p-2 ${active ? `bg-white text-slate-950` : ``} ${disabled ? 'opacity-50 cursor-not-allowed' : `hover:border hover:border-custom-border`}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default NavigationButton;
