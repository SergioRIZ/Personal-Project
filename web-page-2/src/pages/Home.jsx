import React from 'react';
import { Link } from '../Link.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="text-red-600 w-16 h-16"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <path d="M12 12 L22 12" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Bienvenido al maravilloso mundo de los Pokémon
        </h1>
        
        <div className="space-y-4">
          <Link 
            to='/login' 
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            LOG-IN
          </Link>
          
          <Link 
            to='/register' 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            REGISTER
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-white text-center">
        <p className="text-sm">¡Atrapa, entrena y batalla!</p>
      </div>
    </div>
  );
}