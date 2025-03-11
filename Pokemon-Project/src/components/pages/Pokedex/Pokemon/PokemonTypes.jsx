import React from 'react';
import { getTypeColor, translateType } from '../utils';

const PokemonTypes = ({ types, currentLanguage }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {types.map((type) => (
        <span 
          key={type.type.name} 
          className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getTypeColor(type.type.name)} border-2 shadow-sm`}
        >
          {translateType(type.type.name, currentLanguage)}
        </span>
      ))}
    </div>
  );
};

export default PokemonTypes;