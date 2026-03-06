import PokemonCard from './PokemonCard';
import NoResults from '../NoResults';
import type { AbilityMap, PokemonData } from '../ApiService';
import { navigate } from '../../../../navigation';

interface Props {
  filteredPokemon: PokemonData[];
  currentLanguage: string;
  abilityDescriptions: AbilityMap;
}

const PokemonGrid = ({ filteredPokemon, currentLanguage, abilityDescriptions }: Props) => {
  if (filteredPokemon.length === 0) return <NoResults />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto px-4">
      {filteredPokemon.map((pokemon, index) => (
        <div
          className="w-full cursor-pointer animate-slide-up"
          style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
          key={pokemon.id}
          onClick={() => navigate(`/pokemon/${pokemon.id}`)}
        >
          <PokemonCard
            pokemon={pokemon}
            currentLanguage={currentLanguage}
            abilityDescriptions={abilityDescriptions}
          />
        </div>
      ))}
    </div>
  );
};

export default PokemonGrid;
