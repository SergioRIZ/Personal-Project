import React from 'react';
import { Link } from '../../../../../Link';

const Pokeball = () => (
  <Link to="/" className="flex items-center justify-center w-full h-full">
    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-teal-600 to-teal-800 border-4 border-slate-700 relative shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-12">
      <div className="absolute w-full h-2 bg-slate-700 top-1/2 -mt-1 z-10" />
      <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-slate-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-md">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white to-gray-200 opacity-80" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full overflow-hidden">
        <div className="absolute top-1 left-1 w-4 h-4 bg-white opacity-30 rounded-full" />
      </div>
    </div>
  </Link>
);

export default Pokeball;
