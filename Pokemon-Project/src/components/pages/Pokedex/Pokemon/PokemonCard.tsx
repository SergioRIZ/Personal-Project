import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PokemonTypes from './PokemonTypes';
import PokemonStats from './PokemonStats';
import PokemonDimensions from './PokemonDimensions';
import PokemonAbilities from './PokemonAbilities';
import type { AbilityMap } from '../ApiService';
import { useAuth } from '../../../../context/AuthContext';
import { useCollection } from '../../../../context/CollectionContext';

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: { 'official-artwork': { front_default: string } };
  };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  abilities: Array<{ ability: { name: string; url: string }; is_hidden: boolean }>;
  height: number;
  weight: number;
}

interface Props {
  pokemon: PokemonData;
  currentLanguage: string;
  abilityDescriptions: AbilityMap;
}

const PokemonCard = ({ pokemon, currentLanguage, abilityDescriptions }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { collectedIds, addPokemon, removePokemon } = useCollection();
  const [showTooltip, setShowTooltip] = useState(false);
  const pokemonName = pokemon.name.replace('-', ' ');
  const isCollected = collectedIds.has(pokemon.id);
  const sprite =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="bg-white dark:bg-gray-900/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700 w-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <h2
              className="text-base font-bold capitalize text-gray-900 dark:text-white truncate max-w-full"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {pokemonName}
            </h2>
            {showTooltip && (
              <div className="absolute left-0 top-full mt-1 px-3 py-1 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-sm rounded shadow-lg border border-slate-200 dark:border-transparent z-50">
                {pokemonName}
              </div>
            )}
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 font-bold px-3 py-1 rounded-lg text-sm shadow-sm shrink-0">
            #{pokemon.id.toString().padStart(4, '0')}
          </div>
        </div>

        <div className="relative h-52 w-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/50 rounded-lg mb-3 overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="w-28 h-28 border-4 border-slate-300 dark:border-slate-600 rounded-full" />
          </div>
          <img
            src={sprite}
            alt={pokemonName}
            style={{ height: 'auto', width: 'auto', maxHeight: '80%', maxWidth: '80%' }}
            className="z-10 transform hover:scale-110 transition-transform duration-300 drop-shadow-md animate-float"
          />
          {user && (
            <button
              onClick={() => isCollected ? removePokemon(pokemon.id) : addPokemon(pokemon.id, pokemon.name)}
              aria-label={isCollected ? t('collection_remove') : t('collection_add')}
              title={isCollected ? t('collection_remove') : t('collection_add')}
              className={`absolute top-2 right-2 z-30 w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200 cursor-pointer ${
                isCollected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-400 dark:text-slate-300 hover:text-red-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill={isCollected ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
          {pokemon.types.length === 1 ? (
            <div className="absolute bottom-2 right-2 z-20">
              <PokemonTypes types={pokemon.types} currentLanguage={currentLanguage} />
            </div>
          ) : (
            <>
              <div className="absolute bottom-2 left-2 z-20">
                <PokemonTypes types={[pokemon.types[0]]} currentLanguage={currentLanguage} />
              </div>
              <div className="absolute bottom-2 right-2 z-20">
                <PokemonTypes types={[pokemon.types[1]]} currentLanguage={currentLanguage} />
              </div>
            </>
          )}
        </div>

        <PokemonStats stats={pokemon.stats} currentLanguage={currentLanguage} />
        <PokemonDimensions height={pokemon.height} weight={pokemon.weight} />
        <PokemonAbilities abilities={pokemon.abilities} abilityDescriptions={abilityDescriptions} />
      </div>
    </div>
  );
};

export default PokemonCard;
