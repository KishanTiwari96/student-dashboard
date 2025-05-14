import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  helperText,
  className = '',
  ...rest
}: InputFieldProps) => {
  return (
    <div className={`mb-3 md:mb-4 ${className}`}>
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-300 text-xs md:text-sm font-bold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
        bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500
        transition-colors duration-200`}
        {...rest}
      />
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  );
};

export default InputField; 