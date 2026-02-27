import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import SearchBar from './SearchBar';
import ResultsCount from './ResultsCount';
import LoadingScreen from './LoadingScreen';
import ErrorMessage from './ErrorMessage';
import PokemonGrid from './Pokemon/PokemonGrid';
import AnimationsStyle from './AnimationStyle';
import EmptyState from './EmptyState';
import DropdownMenu from './DropdownMenu';
import AuthLinks from './AuthLinks';

import { fetchAbilityDescriptions, type AbilityMap } from './ApiService';
import { fetchPokemonBasicData, searchPokemonByTerm } from './SearchService';
import type { PokemonBasic } from './ApiService';
import { useSettings, GENERATION_RANGES } from '../../../context/SettingsContext';

const Pokedex = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const [allPokemonBasic, setAllPokemonBasic] = useState<PokemonBasic[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<unknown[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [abilityDescriptions, setAbilityDescriptions] = useState<AbilityMap>({});

  // Apply generation filter to the base list
  const filteredByGeneration = useMemo(() => {
    if (settings.generations.length === 0) return allPokemonBasic;
    return allPokemonBasic.filter(p =>
      settings.generations.some(gen => {
        const [min, max] = GENERATION_RANGES[gen];
        return p.id >= min && p.id <= max;
      })
    );
  }, [allPokemonBasic, settings.generations]);

  useEffect(() => {
    const loadBasicData = async () => {
      try {
        const basicData = await fetchPokemonBasicData();
        setAllPokemonBasic(basicData);
        setInitialLoad(false);
      } catch (err) {
        setError(t('errorTitle') + ': ' + (err instanceof Error ? err.message : 'Unknown error'));
        setInitialLoad(false);
      }
    };
    loadBasicData();
  }, [t]);

  useEffect(() => {
    const debouncedSearch = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
          setLoading(true);
          setLoadingProgress(0);

          let results = await searchPokemonByTerm(filteredByGeneration, searchTerm, setLoadingProgress);

          // Apply results limit
          if (settings.resultsLimit !== null) {
            results = results.slice(0, settings.resultsLimit);
          }

          setDisplayedPokemon(results);

          if (results.length > 0) {
            const abilities = await fetchAbilityDescriptions(
              results as Parameters<typeof fetchAbilityDescriptions>[0],
              settings.language
            );
            setAbilityDescriptions(abilities);
          }

          setLoading(false);
        } catch (err) {
          setError(t('errorTitle') + ': ' + (err instanceof Error ? err.message : 'Unknown error'));
          setLoading(false);
        }
      } else {
        setDisplayedPokemon([]);
      }
    }, 500);

    return () => clearTimeout(debouncedSearch);
  }, [searchTerm, filteredByGeneration, t, settings.language, settings.resultsLimit]);

  // Re-fetch ability descriptions when language changes
  useEffect(() => {
    if (displayedPokemon.length > 0) {
      fetchAbilityDescriptions(
        displayedPokemon as Parameters<typeof fetchAbilityDescriptions>[0],
        settings.language
      ).then(setAbilityDescriptions);
    }
  }, [settings.language, displayedPokemon]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (initialLoad) return <LoadingScreen loadingProgress={100} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 py-6 transition-colors duration-300">
      <DropdownMenu />
      <AuthLinks />

      <div className="container mx-auto px-4 pt-16 sm:pt-10">
        <header className="text-center mb-6 sm:mb-8 px-10 sm:px-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-500 mb-2 drop-shadow-md">
            {t('title')}
          </h1>
          {settings.generations.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gen {settings.generations.join(', ')} · {filteredByGeneration.length} Pokémon
            </p>
          )}
        </header>

        <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
        <AnimationsStyle />

        {loading && <LoadingScreen loadingProgress={loadingProgress} />}

        {!loading && (
          <>
            {displayedPokemon.length > 0 && (
              <ResultsCount
                filteredCount={displayedPokemon.length}
                totalCount={filteredByGeneration.length}
              />
            )}
            {displayedPokemon.length === 0 ? (
              <EmptyState />
            ) : (
              <PokemonGrid
                filteredPokemon={displayedPokemon}
                currentLanguage={settings.language}
                abilityDescriptions={abilityDescriptions}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
