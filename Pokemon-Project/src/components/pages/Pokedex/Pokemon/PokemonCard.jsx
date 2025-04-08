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
    <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-gray-700 w-full">
      <div className="p-7 relative">
        {/* Pokemon header with name and ID - without background */}
        <div className="flex items-center justify-between mb-3">
          {/* Pokemon Name with tooltip */}
          <div className="relative flex-grow">
            <h2 
              className="text-xl font-bold capitalize text-slate-800 dark:text-white mr-3 truncate max-w-full"
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
          <div className="bg-gradient-to-br from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 text-slate-800 dark:text-white font-bold px-3 py-1 rounded-lg text-sm shadow-sm flex-shrink-0">
            #{pokemon.id.toString().padStart(4, '0')}
          </div>
        </div>
        
        {/* Special text for Pokemon with ellipsis in their name */}
        {hasEllipsis && (
          <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-yellow-800 dark:text-yellow-200 text-xs font-medium">
            Este Pokémon tiene un nombre con puntos suspensivos (...)
          </div>
        )}
        
        {/* Imagen del Pokémon - centrado y un poco más pequeño */}
        <div className="relative h-40 w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-3 overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="w-50 h-40 border-6 border-slate-300 dark:border-gray-500 rounded-full"></div>
          </div>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemonName}
            className=" cursor-pointer h-38 w-38 object-contain z-10 transform hover:scale-110 transition-transform duration-300 drop-shadow-md animate-float"
          />
        </div>
        
        {/* Types */}
        <PokemonTypes types={pokemon.types} currentLanguage={currentLanguage} />
        
        {/* Stats - versión más compacta */}
        <div className="mt-3">
          <PokemonStats stats={pokemon.stats} currentLanguage={currentLanguage} />
        </div>
        
        {/* Dimensions - ahora en una fila horizontal más ancha */}
        <div className="mt-3">
          <PokemonDimensions height={pokemon.height} weight={pokemon.weight} />
        </div>
        
        {/* Abilities - ahora debajo de las dimensiones */}
        <div className="mt-3 text">
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