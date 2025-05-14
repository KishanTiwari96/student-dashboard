import React from 'react';

interface LoaderProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  variant = 'primary',
  size = 'md',
  fullScreen = false,
  text,
  className = '',
}) => {
  // Color variants
  const variantClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    success: 'text-green-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-indigo-500',
  };

  // Size variants
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  // Full screen wrapper classes
  const fullScreenClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50' 
    : '';

  return (
    <div className={`${fullScreenClasses} flex flex-col items-center justify-center ${className}`}>
      <div className={`inline-block animate-spin rounded-full border-4 border-t-transparent ${variantClasses[variant]} ${sizeClasses[size]}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</p>
      )}
    </div>
  );
};

export default Loader; 