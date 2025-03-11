import React from 'react';
import PokemonTypes from './PokemonTypes';
import PokemonStats from './PokemonStats';
import PokemonDimensions from './PokemonDimensions';
import PokemonAbilities from './PokemonAbilities';

const PokemonCard = ({ pokemon, currentLanguage, abilityDescriptions }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-200">
      <div className="p-4 relative">
        {/* Número de Pokédex */}
        <div className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-lg text-sm">
          #{pokemon.id.toString().padStart(4, '0')}
        </div>
        
        {/* Nombre */}
        <h2 className="text-xl font-bold capitalize text-gray-800 mb-2 pr-16">{pokemon.name.replace('-', ' ')}</h2>
        
        {/* Imagen con fondo */}
        <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="w-40 h-40 border-8 border-gray-300 rounded-full"></div>
          </div>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="h-36 w-36 object-contain z-10 transform hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        {/* Tipos */}
        <PokemonTypes types={pokemon.types} currentLanguage={currentLanguage} />
        
        {/* Estadísticas */}
        <PokemonStats stats={pokemon.stats} currentLanguage={currentLanguage} />
        
        {/* Dimensiones */}
        <PokemonDimensions height={pokemon.height} weight={pokemon.weight} />
        
        {/* Habilidades */}
        <PokemonAbilities abilities={pokemon.abilities} abilityDescriptions={abilityDescriptions} />
      </div>
    </div>
  );
};

export default PokemonCard;