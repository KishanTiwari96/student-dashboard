import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  responsive?: boolean;
}

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  loading = false,
  responsive = false,
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500 shadow-sm hover:shadow',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 shadow-sm hover:shadow',
    info: 'bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-500 shadow-sm hover:shadow',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500',
    text: 'bg-transparent text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:ring-blue-500',
  };

  // Standard size styles
  const defaultSizeStyles = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
  };
  
  // Responsive size styles (smaller on mobile)
  const responsiveSizeStyles = {
    xs: 'py-0.5 px-1.5 text-xs md:py-1 md:px-2',
    sm: 'py-1 px-2 text-xs md:py-1.5 md:px-3 md:text-sm',
    md: 'py-1.5 px-3 text-xs md:py-2 md:px-4 md:text-sm',
    lg: 'py-2 px-4 text-sm md:py-2.5 md:px-5 md:text-base',
  };
  
  // Choose which size style to use based on responsive prop
  const sizeStyles = responsive ? responsiveSizeStyles : defaultSizeStyles;

  const spinnerSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3 w-3 md:h-4 md:w-4',
    md: 'h-4 w-4 md:h-5 md:w-5',
    lg: 'h-4 w-4 md:h-5 md:w-5',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const loadingStyle = loading ? 'relative !text-transparent hover:!text-transparent' : '';
  
  // Get the current text color based on variant
  const getSpinnerColor = () => {
    if (variant === 'outline') return 'text-gray-700 dark:text-gray-300';
    if (variant === 'text') return 'text-blue-600 dark:text-blue-400';
    return 'text-white';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${loadingStyle} ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`inline-block animate-spin rounded-full border-2 border-t-transparent ${getSpinnerColor()} ${responsive ? spinnerSizes[size] : spinnerSizes[size]}`}>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-1 md:mr-2 flex items-center">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-1 md:ml-2 flex items-center">{icon}</span>
      )}
    </button>
  )
}

export default Button 