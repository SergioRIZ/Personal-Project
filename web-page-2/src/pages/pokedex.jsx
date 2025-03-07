import React, { useState, useEffect } from 'react';

const Pokedex = () => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        // Aumentamos el límite para obtener más Pokémon (hasta 898 que son los oficiales excluyendo formas regionales)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1304&offset=0`);
        
        if (!response.ok) {
          throw new Error('No se pudieron cargar los datos');
        }
        
        const data = await response.json();
        
        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json();
          })
        );
        
        setPokemon(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar Pokémon: ' + err.message);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filtrar Pokémon basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPokemon(pokemon);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = pokemon.filter(
        (poke) => 
          poke.name.toLowerCase().includes(term) || 
          poke.id.toString() === term ||
          poke.types.some(type => type.type.name.toLowerCase().includes(term))
      );
      setFilteredPokemon(filtered);
    }
  }, [searchTerm, pokemon]);

  // Obtener color de tipo
  const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-700',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    };
    
    return typeColors[type] || 'bg-gray-400';
  };

  // Determinar el color de fondo basado en el tipo principal del Pokémon
  const getCardBackgroundClass = (types) => {
    if (!types || types.length === 0) return 'bg-white';
    
    const mainType = types[0].type.name;
    const typeBackgrounds = {
      normal: 'bg-gray-100',
      fire: 'bg-red-50',
      water: 'bg-blue-50',
      electric: 'bg-yellow-50',
      grass: 'bg-green-50',
      ice: 'bg-blue-50',
      fighting: 'bg-red-50',
      poison: 'bg-purple-50',
      ground: 'bg-yellow-50',
      flying: 'bg-indigo-50',
      psychic: 'bg-pink-50',
      bug: 'bg-green-50',
      rock: 'bg-yellow-50',
      ghost: 'bg-purple-50',
      dragon: 'bg-indigo-50',
      dark: 'bg-gray-200',
      steel: 'bg-gray-100',
      fairy: 'bg-pink-50'
    };
    
    return typeBackgrounds[mainType] || 'bg-white';
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-600">
        <div className="w-32 h-32 border-8 border-white rounded-full bg-white relative mb-6">
          <div className="absolute inset-0 m-3 rounded-full bg-red-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
        </div>
        <div className="text-2xl font-bold text-white">Cargando Pokédex...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-gray-100 rounded-lg shadow-lg max-w-md mx-auto mt-20">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-xl font-bold mb-2">¡Oh no! Algo salió mal</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-600 pb-16">
      {/* Barra superior */}
      <div className="bg-black py-4 px-6 shadow-lg">
        <div className="flex items-center max-w-7xl mx-auto">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-white mr-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Pokédex Nacional</h1>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barra de búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, número o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent pl-12"
            />
            <div className="absolute left-4 top-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Mostrando {filteredPokemon.length} de {pokemon.length} Pokémon
          </p>
        </div>
        
        {/* Grid de Pokémon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPokemon.map((poke) => (
            <div 
              key={poke.id} 
              className={`rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border-4 border-yellow-400 ${getCardBackgroundClass(poke.types)}`}
            >
              {/* Parte superior con imagen */}
              <div className="p-4 flex flex-col items-center relative">
                <span className="absolute top-2 right-2 font-mono text-lg font-bold text-gray-700 bg-yellow-200 px-2 py-1 rounded-full">
                  #{poke.id.toString().padStart(3, '0')}
                </span>
                
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-gray-200 mb-2 mt-4">
                  <img 
                    src={poke.sprites.front_default || '/api/placeholder/96/96'} 
                    alt={poke.name}
                    className="w-28 h-28 transform scale-125" 
                  />
                </div>
                
                <h2 className="text-xl font-extrabold capitalize text-gray-800">{poke.name}</h2>
                
                <div className="flex space-x-2 mt-2">
                  {poke.types.map((type) => (
                    <span 
                      key={type.type.name}
                      className={`${getTypeColor(type.type.name)} px-3 py-1 rounded-full text-white text-xs uppercase font-bold tracking-wide`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Parte inferior con estadísticas */}
              <div className="bg-white p-4 pt-6 border-t-4 border-gray-200">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-100 p-2 rounded text-center">
                    <span className="block text-xs text-gray-500">Altura</span>
                    <span className="font-bold">{poke.height / 10}m</span>
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-center">
                    <span className="block text-xs text-gray-500">Peso</span>
                    <span className="font-bold">{poke.weight / 10}kg</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {poke.stats.slice(0, 6).map((stat) => (
                    <div key={stat.stat.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium capitalize">{stat.stat.name.replace('-', ' ')}</span>
                        <span className="font-bold">{stat.base_stat}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${stat.stat.name === 'hp' ? 'bg-green-500' : 
                                        stat.stat.name === 'attack' ? 'bg-red-500' : 
                                        'bg-blue-500'} h-2 rounded-full`} 
                          style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mensaje cuando no hay resultados */}
        {filteredPokemon.length === 0 && (
          <div className="text-center mt-8 p-8 bg-white rounded-2xl shadow-lg mx-auto max-w-md">
            <div className="w-24 h-24 mx-auto mb-4 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="#666" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 448c-105.9 0-192-86.1-192-192S150.1 64 256 64s192 86.1 192 192-86.1 192-192 192zm0-256c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">¡Pokémon no encontrado!</h3>
            <p className="text-gray-600 mb-6">No se encontraron Pokémon que coincidan con "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-md"
            >
              Mostrar todos los Pokémon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pokedex;