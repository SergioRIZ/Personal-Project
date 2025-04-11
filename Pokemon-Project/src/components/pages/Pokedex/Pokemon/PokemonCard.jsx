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

  // No necesitamos calcular una escala personalizada para cada Pokémon
  // En su lugar, usaremos un enfoque más simple para mostrar la imagen completa

  return (
    <div className="bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700 dark:border-slate-700 w-full">
      <div className="p-4 relative">
        {/* Pokemon header with name and ID in a single row */}
        <div className="flex items-center justify-between mb-3">
          {/* Left side: Pokemon Name with tooltip */}
          <div className="relative">
            <h2 
              className="text-1xl font-bold capitalize text-white dark:text-white truncate max-w-full"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {pokemonName}
            </h2>
            
            {/* Tooltip for long names - MODIFIED TO APPEAR BELOW THE TEXT */}
            {showTooltip && (
              <div className="absolute left-0 top-full mt-1 px-3 py-1 bg-slate-800 text-white text-sm rounded shadow-lg z-50">
                {pokemonName}
              </div>
            )}
          </div>
          
          {/* Right: Pokemon ID number */}
          <div className="bg-slate-800 dark:bg-slate-800 text-slate-200 dark:text-slate-200 font-bold px-3 py-1 rounded-lg text-sm shadow-sm flex-shrink-0">
            #{pokemon.id.toString().padStart(4, '0')}
          </div>
        </div>
        
        {/* Special text for Pokemon with ellipsis in their name */}
        {hasEllipsis && (
          <div className="mb-3 p-2 bg-yellow-900/50 dark:bg-yellow-900/50 rounded-lg text-yellow-300 dark:text-yellow-300 text-xs font-medium">
            Este Pokémon tiene un nombre con puntos suspensivos (...)
          </div>
        )}
        
        {/* Imagen del Pokémon con tipos en la esquina */}
        <div className="relative h-52 w-full flex items-center justify-center bg-slate-800/50 dark:bg-slate-800/50 rounded-lg mb-3 overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="w-28 h-28 border-6 border-slate-600 dark:border-slate-600 rounded-full"></div>
          </div>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemonName}
            style={{ 
              height: 'auto',
              width: 'auto',
              maxHeight: '80%',
              maxWidth: '80%'
            }}
            className="z-10 transform hover:scale-110 transition-transform duration-300 drop-shadow-md animate-float"
          />
          
          {/* Types positioned at left and right sides */}
          {pokemon.types.length === 1 ? (
            // If only one type, position it on the right
            <div className="absolute bottom-2 right-2 z-20">
              <PokemonTypes types={pokemon.types} currentLanguage={currentLanguage} />
            </div>
          ) : (
            // If two types, position them at left and right edges
            <>
              {/* First type on left */}
              <div className="absolute bottom-2 left-2 z-20">
                <PokemonTypes types={[pokemon.types[0]]} currentLanguage={currentLanguage} />
              </div>
              {/* Second type on right */}
              <div className="absolute bottom-2 right-2 z-20">
                <PokemonTypes types={[pokemon.types[1]]} currentLanguage={currentLanguage} />
              </div>
            </>
          )}
        </div>
        
        {/* Stats - centrados y con nuevo estilo */}
        <div className="mt-3">
          <PokemonStats stats={pokemon.stats} currentLanguage={currentLanguage} />
        </div>
        
        {/* Dimensions with visual indicator of size */}
        <div className="mt-3">
          <PokemonDimensions height={pokemon.height} weight={pokemon.weight} />
        </div>
        
        {/* Abilities - centradas y con nuevo estilo */}
        <div className="mt-3">
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