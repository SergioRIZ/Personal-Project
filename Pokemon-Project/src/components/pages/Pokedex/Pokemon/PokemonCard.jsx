import React, { useState } from 'react';
import PokemonTypes from './PokemonTypes';
import PokemonStats from './PokemonStats';
import PokemonDimensions from './PokemonDimensions';
import PokemonAbilities from './PokemonAbilities';

const PokemonCard = ({ pokemon, currentLanguage, abilityDescriptions }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const pokemonName = pokemon.name.replace('-', ' ');
  
  // Check if the Pokémon name contains three dots (...)
  const hasEllipsis = pokemonName.includes('...');

  return (
    <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-gray-700 w-full max-w-md">
      <div className="p-5 relative">
        {/* Pokemon header with name and ID - without background */}
        <div className="flex items-center justify-between px-0 -mt-2 mb-4">
          {/* Pokemon Name with tooltip */}
          <div className="relative">
            <h2 
              className="text-2xl font-bold capitalize text-slate-800 dark:text-white mr-3 truncate max-w-[200px]"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {pokemonName}
            </h2>
            
            {/* Tooltip for long names */}
            {showTooltip && (
              <div className="absolute top-full left-0 mt-1 px-3 py-1 bg-slate-800 text-white text-sm rounded shadow-lg z-50">
                {pokemonName}
              </div>
            )}
          </div>
          
          {/* Pokemon ID number */}
          <div className="bg-gradient-to-br from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 text-white font-bold px-2 py-1 rounded-lg text-sm shadow-sm flex-shrink-0">
            #{pokemon.id.toString().padStart(4, '0')}
          </div>
        </div>
        
        {/* Special text for Pokemon with ellipsis in their name */}
        {hasEllipsis && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            Este Pokémon tiene un nombre con puntos suspensivos (...)
          </div>
        )}
        
        {/* Image with background */}
        <div className="relative h-56 w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="w-48 h-48 border-8 border-slate-300 dark:border-gray-500 rounded-full"></div>
          </div>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemonName}
            className="h-44 w-44 object-contain z-10 transform hover:scale-110 transition-transform duration-300 drop-shadow-md animate-float"
          />
        </div>
        
        {/* Types */}
        <PokemonTypes types={pokemon.types} currentLanguage={currentLanguage} />
        
        {/* Stats */}
        <div className="mt-5">
          <h3 className="text-md font-semibold text-slate-600 dark:text-gray-300 mb-2">
          </h3>
          <PokemonStats stats={pokemon.stats} currentLanguage={currentLanguage} />
        </div>
        
        {/* Dimensions */}
        <div className="mt-5">
          <h3 className="text-md font-semibold text-slate-600 dark:text-gray-300 mb-2">
          </h3>
          <PokemonDimensions height={pokemon.height} weight={pokemon.weight} />
        </div>
        
        {/* Abilities */}
        <div className="mt-5">
          <h3 className="text-md font-semibold text-slate-600 dark:text-gray-300 mb-2">
          </h3>
          <PokemonAbilities 
            abilities={pokemon.abilities} 
            abilityDescriptions={abilityDescriptions} 
          />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;