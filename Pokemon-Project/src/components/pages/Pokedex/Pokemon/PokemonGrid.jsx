import React from 'react';
import PokemonCard from './PokemonCard';
import NoResults from '../NoResults';

const PokemonGrid = ({ filteredPokemon, currentLanguage, abilityDescriptions }) => {
  return (
    <>
      {filteredPokemon.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto px-4">
          {filteredPokemon.map((pokemon) => (
            <div className="w-full" key={pokemon.id}>
              <PokemonCard 
                pokemon={pokemon}
                currentLanguage={currentLanguage}
                abilityDescriptions={abilityDescriptions}
              />
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </>
  );
};

export default PokemonGrid;