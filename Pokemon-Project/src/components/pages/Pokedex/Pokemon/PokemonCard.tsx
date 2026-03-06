import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PokemonTypes from './PokemonTypes';
import PokemonStats from './PokemonStats';
import PokemonDimensions from './PokemonDimensions';
import PokemonAbilities from './PokemonAbilities';
import type { AbilityMap, PokemonData } from '../ApiService';
import { useAuth } from '../../../../context/AuthContext';
import { useCollection } from '../../../../context/CollectionContext';

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
  const [isShiny, setIsShiny] = useState(false);
  const [spriteOpacity, setSpriteOpacity] = useState(1);

  const handleShinyToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpriteOpacity(0);
    setTimeout(() => {
      setIsShiny(s => !s);
      setSpriteOpacity(1);
    }, 150);
  };
  const pokemonName = pokemon.name.replace('-', ' ');
  const isCollected = collectedIds.has(pokemon.id);
  const normalSprite =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;
  const hasOfficialShiny = !!pokemon.sprites.other['official-artwork'].front_shiny;
  const shinySprite = pokemon.sprites.other['official-artwork'].front_shiny || normalSprite;
  const sprite = isShiny ? shinySprite : normalSprite;

  return (
    <div className="group bg-[var(--color-card)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--color-border)] w-full relative">
      {/* Accent bar */}
      <div className="accent-bar" />

      <div className="p-4">
        {/* Header: Name + ID */}
        <div className="flex items-center justify-between mb-3">
          <div className="relative min-w-0 flex-1">
            <h2
              className="text-base font-bold capitalize text-[var(--text-primary)] truncate"
              style={{ fontFamily: 'var(--font-display)' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {pokemonName}
            </h2>
            {showTooltip && (
              <div className="absolute left-0 top-full mt-1 px-3 py-1 bg-[var(--color-card)] text-[var(--text-primary)] text-sm rounded-lg shadow-lg border border-[var(--color-border)] z-50">
                {pokemonName}
              </div>
            )}
          </div>
          <div
            className="bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold px-3 py-1 rounded-lg text-sm shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            #{pokemon.id.toString().padStart(4, '0')}
          </div>
        </div>

        {/* Image container with diagonal background */}
        <div className="relative h-40 sm:h-52 w-full flex items-center justify-center rounded-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-card-alt), var(--color-surface))' }}
        >
          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-[0.04]">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id={`grid-${pokemon.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill={`url(#grid-${pokemon.id})`} />
            </svg>
          </div>

          <img
            src={sprite}
            alt={pokemonName}
            className="z-10 w-28 h-28 sm:w-36 sm:h-36 object-contain transform group-hover:scale-110 drop-shadow-lg"
            style={{ opacity: spriteOpacity, transition: 'opacity 0.15s ease, transform 0.5s ease' }}
          />

          {/* Shiny toggle button */}
          {hasOfficialShiny && (
            <button
              onClick={handleShinyToggle}
              aria-label={isShiny ? 'Ver forma normal' : 'Ver forma shiny'}
              title={isShiny ? 'Ver forma normal' : 'Ver forma shiny'}
              className={`absolute top-2 left-2 z-30 w-9 h-9 flex items-center justify-center rounded-xl shadow-md transition-all duration-200 cursor-pointer ${
                isShiny
                  ? 'bg-yellow-400 text-white'
                  : 'bg-[var(--color-card)]/80 hover:bg-[var(--color-card)] text-[var(--text-muted)] hover:text-yellow-400 border border-[var(--color-border)]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill={isShiny ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}

          {/* Collection button */}
          {user && (
            <button
              onClick={(e) => { e.stopPropagation(); isCollected ? removePokemon(pokemon.id) : addPokemon(pokemon.id, pokemon.name); }}
              aria-label={isCollected ? t('collection_remove') : t('collection_add')}
              title={isCollected ? t('collection_remove') : t('collection_add')}
              className={`absolute top-2 right-2 z-30 w-9 h-9 flex items-center justify-center rounded-xl shadow-md transition-all duration-200 cursor-pointer ${
                isCollected
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-card)]/80 hover:bg-[var(--color-card)] text-[var(--text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill={isCollected ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

        </div>

        {/* Type badges */}
        <div className="flex justify-center gap-2 mb-3">
          <PokemonTypes types={pokemon.types} currentLanguage={currentLanguage} />
        </div>

        <PokemonStats stats={pokemon.stats} currentLanguage={currentLanguage} />
        <PokemonDimensions height={pokemon.height} weight={pokemon.weight} />
        <PokemonAbilities abilities={pokemon.abilities} abilityDescriptions={abilityDescriptions} />
      </div>
    </div>
  );
};

export default PokemonCard;
