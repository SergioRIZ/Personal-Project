import React from 'react';
import { getTypeColor, translateType } from '../utils';

const PokemonTypes = ({ types, currentLanguage }) => {
  // Función para capitalizar la primera letra
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-1">
      {types.map((type) => (
        <span 
          key={type.type.name} 
          className={`px-3 py-1 rounded-md text-white text-sm font-bold ${getTypeColor(type.type.name)} hover:scale-105 transition-all duration-200 border border-opacity-50 shadow-sm`}
        >
          {capitalize(translateType(type.type.name, currentLanguage))}
        </span>
      ))}
    </div>
  );
};

export default PokemonTypes;