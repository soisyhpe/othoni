import React from 'react';

const PasswordField = ({ label, name, value, onChange, onBlur, showPassword, togglePassword, error }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mt-4 mb-2 text-base font-bold" htmlFor={name}>
        {label}
      </label>
      <div className="relative w-full">
        <input
          className={`pl-4 bg-custom-darker border border-custom-border rounded-lg h-14 w-full outline-none ${
            error ? 'border-red-500' : ''
          }`}
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
        <button
          className="font-semibold absolute top-1/2 right-4 transform -translate-y-1/2"
          type="button"
          onClick={togglePassword}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error ? <div className="text-base text-custom-red">{error}</div> : null}
    </div>
  );
};

export default PasswordField;
