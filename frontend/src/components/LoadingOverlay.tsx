import React from 'react';
import Loader from './Loader';

interface LoadingOverlayProps {
  loading: boolean;
  contained?: boolean;
  message?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
  children?: React.ReactNode;
  blur?: boolean;
  opacity?: 'light' | 'medium' | 'dark';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  contained = false,
  message = 'Loading...',
  variant = 'primary',
  className = '',
  children,
  blur = true,
  opacity = 'medium',
}) => {
  // Don't render anything if not loading and no children
  if (!loading && !children) return null;
  
  // Get opacity values
  const getOpacityClass = () => {
    switch (opacity) {
      case 'light': return 'bg-white/40';
      case 'dark': return 'bg-white/90';
      default: return 'bg-white/70';
    }
  };
  
  // Get positioning classes
  const positioningClass = contained 
    ? 'absolute inset-0' 
    : 'fixed inset-0 z-50';
  
  // Get blur class
  const blurClass = blur ? 'backdrop-blur-sm' : '';
  
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {loading && (
        <div className={`${positioningClass} flex items-center justify-center ${getOpacityClass()} ${blurClass} transition-all duration-300`}>
          <div className="flex flex-col items-center animate-fadeIn">
            <Loader variant={variant} size="lg" text={message} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay; 