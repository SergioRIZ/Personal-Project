import React from "react";
import { Link } from "../../../../Link";

const SignUpFooter = () => {
  return (
    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
      <p className="text-sm text-gray-600">
        Already have an account? 
        <Link to="/login" className="ml-1 font-medium text-red-600 hover:text-red-500">
          Sign in
        </Link>
      </p>
      
      <div className="flex space-x-4">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
      </div>
    </div>
  );
};

export default SignUpFooter;