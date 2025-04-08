import React from 'react';
import { getTypeColor, translateType } from '../utils';

const PokemonTypes = ({ types, currentLanguage }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-1">
      {types.map((type) => (
        <span 
          key={type.type.name} 
          className={`px-3 py-1 rounded-md text-white text-sm font-bold ${getTypeColor(type.type.name)} hover:scale-105 transition-all duration-200 border border-opacity-50 shadow-sm`}
        >
          {translateType(type.type.name, currentLanguage)}
        </span>
      ))}
    </div>
  );
};

export default PokemonTypes;