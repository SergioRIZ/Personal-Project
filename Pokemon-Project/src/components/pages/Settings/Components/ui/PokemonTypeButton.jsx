import React from 'react';

// Type color mapping with gradient backgrounds
const typeColors = {
  normal: 'from-gray-300 to-gray-400',
  fire: 'from-red-400 to-red-500',
  water: 'from-blue-400 to-blue-500',
  grass: 'from-green-400 to-green-500',
  electric: 'from-yellow-300 to-yellow-400',
  ice: 'from-blue-100 to-blue-200',
  fighting: 'from-red-600 to-red-700',
  poison: 'from-purple-400 to-purple-500',
  ground: 'from-yellow-500 to-yellow-600',
  flying: 'from-indigo-200 to-indigo-300',
  psychic: 'from-pink-400 to-pink-500',
  bug: 'from-green-500 to-green-600',
  rock: 'from-yellow-700 to-yellow-800',
  ghost: 'from-purple-600 to-purple-700',
  dragon: 'from-indigo-600 to-indigo-700',
  dark: 'from-gray-700 to-gray-800',
  steel: 'from-gray-400 to-gray-500',
  fairy: 'from-pink-200 to-pink-300'
};

const PokemonTypeButton = ({ type, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-1 px-2 rounded-md text-xs font-medium text-white capitalize bg-gradient-to-r ${typeColors[type]} transition-all duration-300 transform hover:scale-105 shadow-sm ${
        isSelected ? 'ring-2 ring-white dark:ring-gray-200 scale-105' : ''
      }`}
    >
      {type}
    </button>
  );
};

export default PokemonTypeButton;