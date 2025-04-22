import React, { useRef, useEffect, useState } from 'react';
import { Gamepad } from 'lucide-react';

const GameplaySettings = ({ 
  autoSave, 
  setAutoSave,
  difficulty,
  setDifficulty,
  favoriteType,
  setFavoriteType,
  isExpanded, 
  toggleSection 
}) => {
  // Reference to the content that will expand/contract
  const contentRef = useRef(null);
  // State for the maximum height of the content
  const [contentHeight, setContentHeight] = useState(0);

  // Pokemon types for selection
  const pokemonTypes = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 
    'dragon', 'dark', 'steel', 'fairy'
  ];

  // Effect to measure the content height when isExpanded changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  // Function to get type-specific background color
  const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-400',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-green-600',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    };
    
    return typeColors[type] || 'bg-gray-400';
  };

  return (
    <div className="rounded-lg mb-6 overflow-hidden bg-gray-900/60 border border-gray-800">
      {/* Section header - always visible */}
      <div 
        onClick={() => toggleSection('gameplay')}
        className="flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center">
          <Gamepad className="w-5 h-5 mr-3 text-teal-500" />
          <span className="text-white font-normal">Gameplay Settings</span>
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expandable content with transition */}
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: `${contentHeight}px`,
          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden'
        }}
      >
        <div className="p-4">
          {/* Auto-Save Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-blue-400">
                Auto-Save (Every 10 minutes)
              </label>
              <div 
                onClick={() => setAutoSave(!autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${autoSave ? 'bg-teal-500' : 'bg-gray-600'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${autoSave ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-4">
            <label className="block text-sm text-blue-400 mb-2">
              Game Difficulty
            </label>
            <div className="flex space-x-2">
              {['Easy', 'Normal', 'Hard'].map((level, index) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(index)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
                    difficulty === index 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Type Selector */}
          <div className="mb-2">
            <label className="block text-sm text-blue-400 mb-2">
              Favorite Pokémon Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {pokemonTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFavoriteType(type)}
                  className={`py-1 px-2 rounded-md text-xs capitalize transition-all flex items-center justify-center ${
                    favoriteType === type 
                      ? `${getTypeColor(type)} text-white ring-2 ring-white` 
                      : `bg-gray-700 text-gray-300 hover:bg-gray-600`
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameplaySettings;