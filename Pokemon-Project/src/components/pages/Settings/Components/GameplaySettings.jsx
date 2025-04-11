import React from 'react';
import { Gamepad } from 'lucide-react';
import SettingsSection from './ui/SettingSection';
import ToggleSwitch from './ui/ToggleSwitch';
import PokemonTypeButton from './ui/PokemonTypeButton';

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
  // Pokemon types for selection
  const pokemonTypes = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 
    'dragon', 'dark', 'steel', 'fairy'
  ];

  return (
    <SettingsSection 
      title="Gameplay Settings" 
      icon={Gamepad} 
      isExpanded={isExpanded} 
      onToggle={() => toggleSection('gameplay')}
    >
      {/* Auto-Save Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Auto-Save (Every 10 minutes)
          </label>
          <ToggleSwitch 
            isEnabled={autoSave} 
            onToggle={() => setAutoSave(!autoSave)} 
          />
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Game Difficulty
        </label>
        <div className="flex space-x-2">
          {['Easy', 'Normal', 'Hard'].map((level, index) => (
            <button
              key={level}
              onClick={() => setDifficulty(index)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
                difficulty === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Type Selector */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Favorite Pokémon Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {pokemonTypes.map(type => (
            <PokemonTypeButton
              key={type}
              type={type}
              isSelected={favoriteType === type}
              onClick={() => setFavoriteType(type)}
            />
          ))}
        </div>
      </div>
    </SettingsSection>
  );
};

export default GameplaySettings;