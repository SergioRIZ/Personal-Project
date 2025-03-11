import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n-config';
// Componentes
import LanguageSelector from './LanguageSelector';
import SearchBar from './SearchBar';
import ResultsCount from './ResultsCount';
import LoadingScreen from './LoadingScreen';
import ErrorMessage from './ErrorMessage';
import PokemonGrid from './Pokemon/PokemonGrid';
import Footer from './Footer';
import AnimationsStyle from './AnimationStyle';

// Servicios
import { fetchPokemonList, fetchAbilityDescriptions } from './ApiService';

const Pokedex = () => {
  const { t } = useTranslation();
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [abilityDescriptions, setAbilityDescriptions] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('es');

  // Cargar datos de Pokémon
  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        setLoading(true);
        
        // Obtener lista de Pokémon
        const pokemonData = await fetchPokemonList(setLoadingProgress);
        setPokemon(pokemonData);
        setFilteredPokemon(pokemonData);
        
        // Obtener descripciones de habilidades
        const abilities = await fetchAbilityDescriptions(pokemonData, currentLanguage);
        setAbilityDescriptions(abilities);
        
        setLoading(false);
      } catch (err) {
        setError(t('errorTitle') + ': ' + err.message);
        setLoading(false);
      }
    };

    loadPokemonData();
  }, [t]);

  // Actualizar las descripciones de habilidades cuando cambie el idioma
  useEffect(() => {
    if (pokemon.length > 0) {
      const updateAbilityDescriptions = async () => {
        const abilities = await fetchAbilityDescriptions(pokemon, currentLanguage);
        setAbilityDescriptions(abilities);
      };
      
      updateAbilityDescriptions();
    }
  }, [currentLanguage, pokemon]);

  // Filtrar Pokémon cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm)
      );
      setFilteredPokemon(filtered);
    }
  }, [searchTerm, pokemon]);

  // Función para manejar cambios en el campo de búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return <LoadingScreen loadingProgress={loadingProgress} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-white py-6">
      <div className="container mx-auto px-4">
        {/* Cabecera con selector de idioma */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2 drop-shadow-md">{t('title')}</h1>
          
          {/* Selector de idioma */}
          <LanguageSelector 
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />
        </header>
        
        {/* Barra de búsqueda */}
        <SearchBar 
          searchTerm={searchTerm}
          handleSearch={handleSearch}
        />
        
        {/* Número de resultados */}
        <ResultsCount 
          filteredCount={filteredPokemon.length}
          totalCount={pokemon.length}
        />
        
        {/* Estilos de animación */}
        <AnimationsStyle />
        
        {/* Grid de Pokémon */}
        <PokemonGrid 
          filteredPokemon={filteredPokemon}
          currentLanguage={currentLanguage}
          abilityDescriptions={abilityDescriptions}
        />
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Pokedex;