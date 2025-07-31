import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
      
      {/* Loading message */}
      <p className="mt-4 text-gray-300 text-sm font-medium animate-pulse">
        {message}
      </p>
      
      {/* Cosmic dots animation */}
      <div className="flex space-x-1 mt-2">
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
