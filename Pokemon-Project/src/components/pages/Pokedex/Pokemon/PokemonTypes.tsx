import React from 'react';
import { getTypeColor, translateType } from '../utils';

interface PokemonTypeEntry {
  type: { name: string };
}

interface Props {
  types: PokemonTypeEntry[];
  currentLanguage: string;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const PokemonTypes = ({ types, currentLanguage }: Props) => (
  <div className="flex flex-wrap gap-2 justify-center mb-1">
    {types.map(({ type }) => (
      <span
        key={type.name}
        className={`px-3 py-1 rounded-md text-white text-sm font-bold ${getTypeColor(type.name)} hover:scale-105 transition-all duration-200 border border-opacity-50 shadow-sm`}
      >
        {capitalize(translateType(type.name, currentLanguage))}
      </span>
    ))}
  </div>
);

export default PokemonTypes;
