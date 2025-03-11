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
    return <LoadingScreen loadingProgress={100} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
<div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 py-6">
  <div className="px-4">
    <div className="absolute left-4 top-4">
      <Link 
        to="/" 
        className="bg-gradient-to-r from-green-500 to-slate-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        HOME
      </Link>
    </div>
  </div>

  <div className="container mx-auto px-4 pt-10">
    <header className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 mb-2 drop-shadow-md">{t('title')}</h1>
      
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