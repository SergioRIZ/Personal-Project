import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';
import './i18n-config';
import { Link } from '../../../Link';

// Import UI components
import LanguageSelector from './LanguageSelector';
import SearchBar from './SearchBar';
import ResultsCount from './ResultsCount';
import LoadingScreen from './LoadingScreen';
import ErrorMessage from './ErrorMessage';
import PokemonGrid from './Pokemon/PokemonGrid';
import AnimationsStyle from './AnimationStyle';
import EmptyState from './EmptyState';
import DropdownMenu from './DropdownMenu';

// Import API and data services
import { fetchAbilityDescriptions } from './ApiService';
import { fetchPokemonBasicData, searchPokemonByTerm } from './SearchService'

/**
 * Main Pokedex component
 * This component serves as the primary interface for the Pokedex application.
 * It manages the data fetching, search functionality, and renders different UI components
 * based on the current state.
 */
const Pokedex = () => {
  // Get translation function from i18n
  const { t } = useTranslation();
  
  // State management
  const [allPokemonBasic, setAllPokemonBasic] = useState([]); // Stores all Pokemon data
  const [displayedPokemon, setDisplayedPokemon] = useState([]); // Stores filtered Pokemon results
  const [initialLoad, setInitialLoad] = useState(true); // Controls initial loading state
  const [loading, setLoading] = useState(false); // Controls loading state during searches
  const [error, setError] = useState(null); // Manages error state
  const [searchTerm, setSearchTerm] = useState(''); // Stores the current search query
  const [loadingProgress, setLoadingProgress] = useState(0); // Tracks loading progress percentage
  const [abilityDescriptions, setAbilityDescriptions] = useState({}); // Stores ability descriptions
  const [currentLanguage, setCurrentLanguage] = useState('es'); // Tracks the selected language

  /**
   * Effect hook to load the initial Pokemon data when the component mounts
   * This runs once when the component is first rendered
   */
  useEffect(() => {
    const loadBasicData = async () => {
      try {
        // Fetch all basic Pokemon data
        const basicData = await fetchPokemonBasicData();
        setAllPokemonBasic(basicData);
        setInitialLoad(false); // Finish initial loading
      } catch (err) {
        // Handle errors during data fetching
        setError(t('errorTitle') + ': ' + err.message);
        setInitialLoad(false);
      }
    };

    loadBasicData();
  }, [t]); // Re-run if translation function changes

  /**
   * Effect hook to handle search functionality with debouncing
   * This runs whenever searchTerm, allPokemonBasic, t, or currentLanguage changes
   */
  useEffect(() => {
    // Debounce search to prevent excessive API calls while typing
    const debouncedSearch = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
          setLoading(true);
          setLoadingProgress(0);
          
          // Search for Pokemon matching the search term
          const results = await searchPokemonByTerm(
            allPokemonBasic, 
            searchTerm, 
            setLoadingProgress
          );
          
          setDisplayedPokemon(results);
          
          // If results found, fetch ability descriptions
          if (results.length > 0) {
            const abilities = await fetchAbilityDescriptions(results, currentLanguage);
            setAbilityDescriptions(abilities);
          }
          
          setLoading(false);
        } catch (err) {
          // Handle search errors
          setError(t('errorTitle') + ': ' + err.message);
          setLoading(false);
        }
      } else {
        // Clear results when search term is empty
        setDisplayedPokemon([]);
      }
    }, 500); // 500ms debounce delay
    
    // Clean up timeout when component unmounts or dependencies change
    return () => clearTimeout(debouncedSearch);
  }, [searchTerm, allPokemonBasic, t, currentLanguage]);

  /**
   * Effect hook to update ability descriptions when language changes
   * This ensures descriptions are in the correct language
   */
  useEffect(() => {
    if (displayedPokemon.length > 0) {
      const updateAbilityDescriptions = async () => {
        const abilities = await fetchAbilityDescriptions(displayedPokemon, currentLanguage);
        setAbilityDescriptions(abilities);
      };
      
      updateAbilityDescriptions();
    }
  }, [currentLanguage, displayedPokemon]);

  /**
   * Handler function for search input changes
   * @param {Event} event - The input change event
   */
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Render loading screen during initial data fetch
  if (initialLoad) {
    return (
        <LoadingScreen loadingProgress={100} />
    );
  }

  // Render error message if an error occurred
  if (error) {
    return (
        <ErrorMessage error={error} />
    );
  }

  // Main render for the Pokedex interface
  return (
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 py-6 transition-colors duration-300">
        {/* Navigation dropdown menu */}
        <DropdownMenu/>

        {/* Login/Signup links section */}
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

        {/* Main content container */}
        <div className="container mx-auto px-4 pt-10">
          {/* Header section with title and language selector */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-500 mb-2 drop-shadow-md">{t('title')}</h1>
            
            {/* Language selector component */}
            <LanguageSelector 
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
            />
          </header>
          
          {/* Search input component */}
          <SearchBar 
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
          
          {/* Component for animations styling */}
          <AnimationsStyle />
          
          {/* Show loading screen during search */}
          {loading && <LoadingScreen loadingProgress={loadingProgress} />}
          
          {/* Conditionally render results or empty state */}
          {!loading && (
            <>
              {/* Show results count when Pokemon are found */}
              {displayedPokemon.length > 0 && (
                <ResultsCount 
                  filteredCount={displayedPokemon.length}
                  totalCount={allPokemonBasic.length}
                />
              )}
              
              {/* Show empty state or Pokemon grid based on search results */}
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