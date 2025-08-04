import React from 'react';
import { Link } from 'react-router-dom';
import { StarfieldBackground } from '@/components/shared';

/**
 * 404 Not Found page component
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      {/* Starfield Background */}
      <StarfieldBackground />
      
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-400 mb-4 drop-shadow-lg">404</h1>
          <h2 className="text-3xl font-semibold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Back to Home
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link
              to="/globe"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Explore Globe
            </Link>
            <Link
              to="/submit-prayer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Submit Prayer
            </Link>
            <Link
              to="/wall-of-prayers"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Prayer Wall
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
