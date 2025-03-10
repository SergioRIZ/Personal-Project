import React, { useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// Initialize i18next with translations
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          loading: "Loading Pokédex...",
          completed: "completed",
          errorTitle: "Error loading Pokédex!",
          title: "National Pokédex",
          searchPlaceholder: "Search by name or number...",
          showing: "Showing",
          of: "of",
          pokemon: "Pokémon",
          baseStats: "Base Stats",
          height: "Height",
          weight: "Weight",
          abilities: "Abilities",
          hidden: "Hidden",
          noResults: "No Pokémon found",
          tryAgain: "Try another search term",
          dataProvided: "Data provided by",
          m: "m",
          kg: "kg"
        }
      },
      es: {
        translation: {
          loading: "Cargando Pokédex...",
          completed: "completado",
          errorTitle: "¡Error al cargar la Pokédex!",
          title: "Pokédex Nacional",
          searchPlaceholder: "Buscar por nombre o número...",
          showing: "Mostrando",
          of: "de",
          pokemon: "Pokémon",
          baseStats: "Estadísticas base",
          height: "Altura",
          weight: "Peso",
          abilities: "Habilidades",
          hidden: "Oculta",
          noResults: "No se encontraron Pokémon",
          tryAgain: "Intenta con otro término de búsqueda",
          dataProvided: "Datos proporcionados por",
          m: "m",
          kg: "kg"
        }
      }
    },
    lng: "es", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

const Pokedex = () => {
  const { t, i18n } = useTranslation();
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [abilityDescriptions, setAbilityDescriptions] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('es');

  // Función para cambiar el idioma
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  // Función para obtener los datos de los Pokémon
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        
        // Obtenemos la lista completa de 1304 Pokémon
        const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1304');
        const listData = await listResponse.json();
        
        // Array para almacenar todos los detalles
        const allPokemonDetails = [];
        
        // Cargamos los pokémon en grupos para mostrar progreso
        const totalPokemon = listData.results.length;
        const chunkSize = 20;
        
        for (let i = 0; i < totalPokemon; i += chunkSize) {
          const chunk = listData.results.slice(i, i + chunkSize);
          
          const chunkDetails = await Promise.all(
            chunk.map(async (pokemon) => {
              const detailResponse = await fetch(pokemon.url);
              return await detailResponse.json();
            })
          );
          
          allPokemonDetails.push(...chunkDetails);
          
          // Actualizar el progreso
          setLoadingProgress(Math.floor((allPokemonDetails.length / totalPokemon) * 100));
        }
        
        // Ordenamos por ID
        const sortedPokemon = allPokemonDetails.sort((a, b) => a.id - b.id);
        
        setPokemon(sortedPokemon);
        setFilteredPokemon(sortedPokemon);
        
        // Obtener descripciones de habilidades únicas
        await fetchAbilityDescriptions(sortedPokemon);
        
        setLoading(false);
      } catch (err) {
        setError(t('errorTitle') + ': ' + err.message);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [t]);

  // Función para obtener descripciones de las habilidades
  const fetchAbilityDescriptions = async (pokemonList) => {
    try {
      // Extraer todas las URLs de habilidades únicas
      const abilityUrls = new Set();
      pokemonList.forEach(pokemon => {
        pokemon.abilities.forEach(ability => {
          abilityUrls.add(ability.ability.url);
        });
      });
      
      // Obtener detalles de cada habilidad
      const abilityDetails = {};
      
      await Promise.all(
        Array.from(abilityUrls).map(async (url) => {
          const response = await fetch(url);
          const data = await response.json();
          
          // Buscar la descripción según el idioma actual
          const targetLang = currentLanguage === 'es' ? 'es' : 'en';
          const localizedDescription = data.flavor_text_entries.find(
            entry => entry.language.name === targetLang
          );
          
          // Si no hay descripción en el idioma actual, buscar en el otro idioma
          const description = localizedDescription 
            ? localizedDescription.flavor_text 
            : data.flavor_text_entries.find(entry => entry.language.name === (targetLang === 'es' ? 'en' : 'es'))?.flavor_text 
              || 'No hay descripción disponible';
          
          abilityDetails[data.name] = {
            description: description,
            name: data.names.find(name => name.language.name === targetLang)?.name || data.name.replace('-', ' ')
          };
        })
      );
      
      setAbilityDescriptions(abilityDetails);
    } catch (err) {
      console.error('Error al obtener descripciones de habilidades:', err);
    }
  };

  // Actualizar las descripciones de habilidades cuando cambie el idioma
  useEffect(() => {
    if (pokemon.length > 0) {
      fetchAbilityDescriptions(pokemon);
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

  // Función para obtener un color basado en el tipo de Pokémon
  const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-400 border-gray-500',
      fire: 'bg-red-500 border-red-600',
      water: 'bg-blue-500 border-blue-600',
      electric: 'bg-yellow-400 border-yellow-500',
      grass: 'bg-green-500 border-green-600',
      ice: 'bg-blue-200 border-blue-300',
      fighting: 'bg-red-700 border-red-800',
      poison: 'bg-purple-500 border-purple-600',
      ground: 'bg-yellow-700 border-yellow-800',
      flying: 'bg-indigo-300 border-indigo-400',
      psychic: 'bg-pink-500 border-pink-600',
      bug: 'bg-green-600 border-green-700',
      rock: 'bg-yellow-800 border-yellow-900',
      ghost: 'bg-purple-700 border-purple-800',
      dragon: 'bg-indigo-700 border-indigo-800',
      dark: 'bg-gray-800 border-gray-900',
      steel: 'bg-gray-500 border-gray-600',
      fairy: 'bg-pink-300 border-pink-400'
    };
    
    return typeColors[type] || 'bg-gray-400 border-gray-500';
  };

  // Función para obtener el color del stat
  const getStatColor = (statName) => {
    const statColors = {
      'hp': 'bg-red-500',
      'attack': 'bg-orange-500',
      'defense': 'bg-yellow-500',
      'special-attack': 'bg-blue-500',
      'special-defense': 'bg-green-500',
      'speed': 'bg-purple-500'
    };
    
    return statColors[statName] || 'bg-gray-500';
  };

  // Función para traducir nombres de stats
  const translateStatName = (statName) => {
    const statTranslations = {
      'hp': 'HP',
      'attack': currentLanguage === 'es' ? 'Ataque' : 'Attack',
      'defense': currentLanguage === 'es' ? 'Defensa' : 'Defense',
      'special-attack': currentLanguage === 'es' ? 'Ataque Esp.' : 'Sp. Attack',
      'special-defense': currentLanguage === 'es' ? 'Defensa Esp.' : 'Sp. Defense',
      'speed': currentLanguage === 'es' ? 'Velocidad' : 'Speed'
    };
    
    return statTranslations[statName] || statName.replace('-', ' ');
  };

  // Traducir tipos de Pokémon
  const translateType = (type) => {
    const typeTranslations = {
      'normal': currentLanguage === 'es' ? 'normal' : 'normal',
      'fire': currentLanguage === 'es' ? 'fuego' : 'fire',
      'water': currentLanguage === 'es' ? 'agua' : 'water',
      'electric': currentLanguage === 'es' ? 'eléctrico' : 'electric',
      'grass': currentLanguage === 'es' ? 'planta' : 'grass',
      'ice': currentLanguage === 'es' ? 'hielo' : 'ice',
      'fighting': currentLanguage === 'es' ? 'lucha' : 'fighting',
      'poison': currentLanguage === 'es' ? 'veneno' : 'poison',
      'ground': currentLanguage === 'es' ? 'tierra' : 'ground',
      'flying': currentLanguage === 'es' ? 'volador' : 'flying',
      'psychic': currentLanguage === 'es' ? 'psíquico' : 'psychic',
      'bug': currentLanguage === 'es' ? 'bicho' : 'bug',
      'rock': currentLanguage === 'es' ? 'roca' : 'rock',
      'ghost': currentLanguage === 'es' ? 'fantasma' : 'ghost',
      'dragon': currentLanguage === 'es' ? 'dragón' : 'dragon',
      'dark': currentLanguage === 'es' ? 'siniestro' : 'dark',
      'steel': currentLanguage === 'es' ? 'acero' : 'steel',
      'fairy': currentLanguage === 'es' ? 'hada' : 'fairy'
    };
    
    return typeTranslations[type] || type;
  };

  const Tooltip = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        
        {isVisible && (
          <div className="absolute bottom-full mb-2 w-40 max-w-xs md:max-w-md rounded-md shadow-lg bg-white border border-gray-200 p-3 text-left animate-fade-in-fast">
            <div className="absolute w-3 h-3 bg-white transform rotate-45 -bottom-1.5 left-1/2 -ml-13.5 border-r border-b border-gray-200"></div>
              {content}
            </div>
        )}
      </div>
    );
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50">
        <div className="w-64 h-64 relative mb-8">
          <div className="absolute inset-0 rounded-full border-8 border-gray-300 border-t-red-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/web-page-2/public/pokemon.svg" alt="Pokeball" className="h-32 w-32 animate-pulse" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600 mb-2">{t('loading')}</p>
        <div className="w-64 bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-red-600 h-4 rounded-full transition-all duration-300" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-700">{loadingProgress}% {t('completed')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-12" role="alert">
        <div className="flex items-center">
          <div className="py-1">
            <svg className="h-6 w-6 text-red-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">{t('errorTitle')}</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-white py-6">
      <div className="container mx-auto px-4">
        {/* Cabecera con selector de idioma */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2 drop-shadow-md">{t('title')}</h1>
          
          {/* Selector de idioma */}
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => changeLanguage('es')} 
              className={`px-3 py-1 rounded-l-lg ${currentLanguage === 'es' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              ES
            </button>
            <button 
              onClick={() => changeLanguage('en')} 
              className={`px-3 py-1 rounded-r-lg ${currentLanguage === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              EN
            </button>
          </div>
        </header>
        
        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full p-4 pl-12 border-2 border-red-400 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Número de resultados */}
        <div className="max-w-6xl mx-auto mb-6 px-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center border-l-4 border-red-500">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">
              <span className="font-bold">#</span>
            </div>
            <p className="text-gray-700 font-medium">
              {t('showing')} <span className="font-bold text-red-600">{filteredPokemon.length}</span> {t('of')} <span className="font-bold text-red-600">{pokemon.length}</span> {t('pokemon')}
            </p>
          </div>
        </div>
        
        {/* Estilos de animación */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-fast {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>
        
        {/* Grid de Pokémon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredPokemon.map((poke) => (
            <div key={poke.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-200">
              <div className="p-4 relative">
                {/* Número de Pokédex */}
                <div className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-lg text-sm">
                  #{poke.id.toString().padStart(4, '0')}
                </div>
                
                {/* Nombre */}
                <h2 className="text-xl font-bold capitalize text-gray-800 mb-2 pr-16">{poke.name.replace('-', ' ')}</h2>
                
                {/* Imagen con fondo */}
                <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <div className="w-40 h-40 border-8 border-gray-300 rounded-full"></div>
                  </div>
                  <img
                    src={poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default}
                    alt={poke.name}
                    className="h-36 w-36 object-contain z-10 transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Tipos */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {poke.types.map((type) => (
                    <span 
                      key={type.type.name} 
                      className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getTypeColor(type.type.name)} border-2 shadow-sm`}
                    >
                      {translateType(type.type.name)}
                    </span>
                  ))}
                </div>
                
                {/* Estadísticas */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h3 className="font-bold text-gray-700 mb-2 text-center border-b border-gray-200 pb-1">{t('baseStats')}</h3>
                  <div className="space-y-2">
                    {poke.stats.map((stat) => (
                      <div key={stat.stat.name} className="flex items-center">
                        <div className="w-28 text-xs font-medium capitalize text-gray-600">
                          {translateStatName(stat.stat.name)}:
                        </div>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStatColor(stat.stat.name)}`} 
                            style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="w-10 text-right text-xs font-bold ml-1 text-gray-700">
                          {stat.base_stat}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Medidas */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="text-center p-1 bg-blue-50 rounded border border-blue-100">
                      <p className="text-xs text-blue-700 font-medium">{t('height')}</p>
                      <p className="font-bold text-gray-700">{(poke.height / 10).toFixed(1)} {t('m')}</p>
                    </div>
                    <div className="text-center p-1 bg-amber-50 rounded border border-amber-100">
                      <p className="text-xs text-amber-700 font-medium">{t('weight')}</p>
                      <p className="font-bold text-gray-700">{(poke.weight / 10).toFixed(1)} {t('kg')}</p>
                    </div>
                  </div>
                  
                  {/* Habilidades con tooltips */}
                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-gray-600 mb-1">{t('abilities')}:</h4>
                    <div className="flex flex-wrap gap-1">
                      {poke.abilities.map((ability) => {
                        const abilityInfo = abilityDescriptions[ability.ability.name];
                        const tooltipContent = (
                          <div>
                            <p className="font-bold text-gray-800 capitalize mb-1">
                              {abilityInfo?.name || ability.ability.name.replace('-', ' ')}
                              {ability.is_hidden && <span className="ml-1 text-gray-500 text-xs italic">({t('hidden')})</span>}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {abilityInfo?.description || 'Cargando descripción...'}
                            </p>
                          </div>
                        );
                        
                        return (
                          <Tooltip key={ability.ability.name} content={tooltipContent}>
                            <span 
                              className={`cursor-help px-2 py-1 bg-red-50 border border-red-100 rounded text-xs capitalize text-red-700 ${ability.is_hidden ? 'italic' : ''}`}
                            >
                              {ability.ability.name.replace('-', ' ')}
                              {ability.is_hidden && <span className="text-xs ml-1 text-gray-500">(O)</span>}
                            </span>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mensaje si no hay resultados */}
        {filteredPokemon.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <div className="inline-block mb-4">
              <img src="/api/placeholder/100/100" alt="Pokeball vacía" className="h-20 w-20 mx-auto opacity-30" />
            </div>
            <p className="text-gray-600 text-xl mb-2">{t('noResults')}</p>
            <p className="text-gray-500">{t('tryAgain')}</p>
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>{t('dataProvided')} <span className="font-medium">PokéAPI</span></p>
        </footer>
      </div>
    </div>
  );
};

export default Pokedex;