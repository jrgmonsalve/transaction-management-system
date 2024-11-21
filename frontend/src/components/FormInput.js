// src/components/FormInput.js
import React from 'react';

const FormInput = ({ 
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  ...props
}) => (
  <div className="flex flex-col gap-1">
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border rounded p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

export default FormInput;