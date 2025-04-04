import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';
import './i18n-config';
import { Link } from '../../../Link';

import LanguageSelector from './LanguageSelector';
import SearchBar from './SearchBar';
import ResultsCount from './ResultsCount';
import LoadingScreen from './LoadingScreen';
import ErrorMessage from './ErrorMessage';
import PokemonGrid from './Pokemon/PokemonGrid';
import AnimationsStyle from './AnimationStyle';
import EmptyState from './EmptyState';
import DropdownMenu from './DropdownMenu';
import { ThemeProvider } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

import { fetchAbilityDescriptions } from './ApiService';
import { fetchPokemonBasicData, searchPokemonByTerm } from './SearchService'

const Pokedex = () => {
  const { t } = useTranslation();
  const [allPokemonBasic, setAllPokemonBasic] = useState([]); 
  const [displayedPokemon, setDisplayedPokemon] = useState([]); 
  const [initialLoad, setInitialLoad] = useState(true);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [abilityDescriptions, setAbilityDescriptions] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('es');


  useEffect(() => {
    const loadBasicData = async () => {
      try {

        const basicData = await fetchPokemonBasicData();
        setAllPokemonBasic(basicData);
        setInitialLoad(false);
      } catch (err) {
        setError(t('errorTitle') + ': ' + err.message);
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
          

          const results = await searchPokemonByTerm(
            allPokemonBasic, 
            searchTerm, 
            setLoadingProgress
          );
          
          setDisplayedPokemon(results);
          

          if (results.length > 0) {
            const abilities = await fetchAbilityDescriptions(results, currentLanguage);
            setAbilityDescriptions(abilities);
          }
          
          setLoading(false);
        } catch (err) {
          setError(t('errorTitle') + ': ' + err.message);
          setLoading(false);
        }
      } else {
 
        setDisplayedPokemon([]);
      }
    }, 500); 
    
    return () => clearTimeout(debouncedSearch);
  }, [searchTerm, allPokemonBasic, t, currentLanguage]);


  useEffect(() => {
    if (displayedPokemon.length > 0) {
      const updateAbilityDescriptions = async () => {
        const abilities = await fetchAbilityDescriptions(displayedPokemon, currentLanguage);
        setAbilityDescriptions(abilities);
      };
      
      updateAbilityDescriptions();
    }
  }, [currentLanguage, displayedPokemon]);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  if (initialLoad) {
    return (
        <LoadingScreen loadingProgress={100} />
    );
  }

  if (error) {
    return (
        <ErrorMessage error={error} />
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 py-6 transition-colors duration-300">
        <DropdownMenu/>
        <ThemeToggle />
        
        <div className="px-4 flex justify-between items-center">
          <div className="absolute right-4 top-4 flex space-x-6">
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b border-transparent hover:border-gray-700 dark:hover:border-gray-300 transition-all duration-300"
            > 
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b border-transparent hover:border-gray-700 dark:hover:border-gray-300 transition-all duration-300"
            > 
              SIGN-UP
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-10">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-500 mb-2 drop-shadow-md">{t('title')}</h1>
            
            <LanguageSelector 
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
            />
          </header>
          
          <SearchBar 
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
          
          <AnimationsStyle />
          
          {loading && <LoadingScreen loadingProgress={loadingProgress} />}
          
          {!loading && (
            <>
              {displayedPokemon.length > 0 && (
                <ResultsCount 
                  filteredCount={displayedPokemon.length}
                  totalCount={allPokemonBasic.length}
                />
              )}
              
              {displayedPokemon.length === 0 ? (
                <EmptyState />
              ) : (
                <PokemonGrid 
                  filteredPokemon={displayedPokemon}
                  currentLanguage={currentLanguage}
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