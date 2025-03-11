import React from 'react';
import PokemonCard from './PokemonCard';
import NoResults from '../NoResults';

const PokemonGrid = ({ filteredPokemon, currentLanguage, abilityDescriptions }) => {
  return (
    <>
      {filteredPokemon.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard 
              key={pokemon.id} 
              pokemon={pokemon}
              currentLanguage={currentLanguage}
              abilityDescriptions={abilityDescriptions}
            />
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </>
  );
};

export default PokemonGrid;