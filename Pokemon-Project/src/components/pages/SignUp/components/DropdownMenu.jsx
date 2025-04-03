import React, { useState } from 'react';
import { Link } from '../../../../Link';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Pokedex', to: '/pokedex' },
    { label: 'Settings', to: '/settings' },
    { label: 'Dark Mode', to: '/dark-mode' },
    { label: 'Language', to: '/language' },
    { label: 'Login', to: '/login' }
  ];

  return (
    <div className="absolute top-4 left-4">
      <div 
        className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-bold">☰</span>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;