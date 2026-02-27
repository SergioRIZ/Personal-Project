import React from 'react';
import PokemonCard from './PokemonCard';
import NoResults from '../NoResults';
import type { AbilityMap } from '../ApiService';

interface Props {
  filteredPokemon: unknown[];
  currentLanguage: string;
  abilityDescriptions: AbilityMap;
}

const PokemonGrid = ({ filteredPokemon, currentLanguage, abilityDescriptions }: Props) => {
  if (filteredPokemon.length === 0) return <NoResults />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto px-4">
      {filteredPokemon.map(pokemon => {
        const p = pokemon as { id: number };
        return (
          <div className="w-full" key={p.id}>
            <PokemonCard
              pokemon={pokemon as Parameters<typeof PokemonCard>[0]['pokemon']}
              currentLanguage={currentLanguage}
              abilityDescriptions={abilityDescriptions}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PokemonGrid;
