import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Home
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link
              to="/globe"
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Explore Globe
            </Link>
            <Link
              to="/submit-prayer"
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Submit Prayer
            </Link>
            <Link
              to="/wall-of-prayers"
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
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
