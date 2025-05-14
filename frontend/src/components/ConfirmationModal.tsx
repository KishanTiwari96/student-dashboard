import React, { useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
  customContent?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
  customContent
}) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Close modal on escape key
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Define color schemes based on type
  const getColorScheme = () => {
    switch(type) {
      case 'danger':
        return {
          icon: 'text-red-500',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
          iconBg: 'bg-amber-100'
        };
      default:
        return {
          icon: 'text-blue-500',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBg: 'bg-blue-100'
        };
    }
  };
  
  const colorScheme = getColorScheme();
  
  if (!isOpen) return null;
  
  return createPortal(
    <Fragment>
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all mx-3 sm:mx-0"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${colorScheme.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                {type === 'danger' && (
                  <svg className={`h-5 w-5 ${colorScheme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {type === 'warning' && (
                  <svg className={`h-5 w-5 ${colorScheme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {type === 'info' && (
                  <svg className={`h-5 w-5 ${colorScheme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
            {customContent && (
              <div className="mt-4">
                {customContent}
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-sm font-medium text-white ${colorScheme.confirmBtn} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto transition-colors`}
              onClick={() => {
                onConfirm();
                if (!loading) onClose();
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {confirmText}
                </span>
              ) : confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </Fragment>,
    document.body
  );
};

export default ConfirmationModal; 