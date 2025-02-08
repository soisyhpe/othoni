import React from 'react';

const InputField = ({ label, name, type, value, onChange, onBlur, error }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-base font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        className={`pl-4 bg-custom-darker border border-custom-border rounded-lg h-14 w-full outline-none ${
          error ? 'border-red-500' : ''
        }`}
        type={type}
        id={name}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {error ? <div className="text-base text-custom-red">{error}</div> : null}
    </div>
  );
};

export default InputField;
