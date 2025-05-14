import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-blue-200 hover:border-blue-300 p-6 transition-all duration-300 ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card; 