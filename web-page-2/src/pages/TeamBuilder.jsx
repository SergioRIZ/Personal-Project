import React, { useState, useEffect } from 'react';
import { Link } from '../Link';

const PokemonTeamBuilder = () => {
    const [teamName, setTeamName] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [allPokemon, setAllPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20; // Cantidad de Pokémon por página

    // Cargar Pokémon de la API
    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                // Calcular el offset basado en la página actual
                const offset = (currentPage - 1) * limit;
                // Hacer la petición a la API
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
                
                if (!response.ok) {
                    throw new Error('Error al cargar los Pokémon');
                }
                
                const data = await response.json();
                
                // Calcular el total de páginas
                setTotalPages(Math.ceil(data.count / limit));
                
                // Para cada Pokémon, obtener más detalles
                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const detailResponse = await fetch(pokemon.url);
                        if (!detailResponse.ok) {
                            throw new Error(`Error al cargar detalles de ${pokemon.name}`);
                        }
                        const detail = await detailResponse.json();
                        return {
                            id: detail.id,
                            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                            sprite: detail.sprites.front_default,
                            types: detail.types.map(type => type.type.name)
                        };
                    })
                );
                
                setAllPokemon(pokemonDetails);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching Pokémon:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [currentPage]);

    // Filtrar Pokémon basado en término de búsqueda
    const filteredPokemon = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Efecto para manejar selección de todos
    useEffect(() => {
        if (selectAll) {
            const pokemonToSelect = filteredPokemon.slice(0, 6); // Solo selecciona hasta 6 máximo
            setSelectedPokemon(pokemonToSelect);
        }
    }, [selectAll, searchTerm]);

    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectAll(false); // Resetear selectAll cuando cambia la búsqueda
    };

    const handleSelectAll = () => {
        if (!selectAll && filteredPokemon.length > 0) {
            const pokemonToSelect = filteredPokemon.slice(0, 6); // Solo selecciona hasta 6 máximo
            setSelectedPokemon(pokemonToSelect);
            setSelectAll(true);
        } else {
            setSelectedPokemon([]);
            setSelectAll(false);
        }
    };

    const handlePokemonSelect = (pokemon) => {
        if (selectedPokemon.length < 6 && !selectedPokemon.some(p => p.id === pokemon.id)) {
            setSelectedPokemon([...selectedPokemon, pokemon]);
        }
    };

    const handleRemovePokemon = (pokemon) => {
        setSelectedPokemon(selectedPokemon.filter(p => p.id !== pokemon.id));
        setSelectAll(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setSearchTerm('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (teamName && selectedPokemon.length > 0) {
            setIsBuilding(true);
            // Simulate team creation process
            setTimeout(() => {
                alert(`Equipo "${teamName}" creado exitosamente con ${selectedPokemon.length} Pokémon!`);
                setIsBuilding(false);
                // Opcional: resetear formulario después de crear equipo
                // setTeamName('');
                // setSelectedPokemon([]);
                // setSearchTerm('');
                // setSelectAll(false);
            }, 1500);
        }
    };

    // Obtener tipos de Pokémon con colores asociados
    const getTypeColor = (type) => {
        const typeColors = {
            normal: 'bg-gray-400',
            fire: 'bg-red-500',
            water: 'bg-blue-500',
            grass: 'bg-green-500',
            electric: 'bg-yellow-400',
            ice: 'bg-blue-200',
            fighting: 'bg-red-700',
            poison: 'bg-purple-500',
            ground: 'bg-yellow-700',
            flying: 'bg-indigo-300',
            psychic: 'bg-pink-500',
            bug: 'bg-green-600',
            rock: 'bg-yellow-600',
            ghost: 'bg-purple-700',
            dragon: 'bg-indigo-600',
            dark: 'bg-gray-800',
            steel: 'bg-gray-500',
            fairy: 'bg-pink-300',
            default: 'bg-gray-400'
        };

        return typeColors[type] || typeColors.default;
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('/pokemon-background.svg')] p-4 bg-no-repeat bg-cover bg-center">
            {/* Header con logotipo */}
            <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full relative">
    {/* Red top half */}
    <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full overflow-hidden">
    </div>
    {/* White bottom half */}
    <div className="absolute bottom-0.5 left-0 w-full h-1/2 bg-white rounded-b-full border-t border-black">
        <div className="absolute top-0 left-0 w-full h-1/8 bg-black"></div>
    </div>
    
    {/* Center button */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-4xl border-6 border-gray-700 z-10"></div>
    
    {/* Black border */}
    <div className="absolute inset-0 border-6 border-black rounded-full pointer-events-none"></div>
                </div>
                <h1 className="text-5xl text-red-600 mb-2">Pokemon League</h1>
            </div>
            
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
                    
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Construye tu Equipo</h2>
                            <p className="text-gray-600 mt-2">Selecciona hasta 6 Pokémon</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamName">
                                    Nombre del Equipo
                                </label>
                                <input
                                    type="text"
                                    id="teamName"
                                    value={teamName}
                                    onChange={handleTeamNameChange}
                                    className="py-3 px-4 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre de tu equipo"
                                />
                            </div>
                            
                            {/* Filtro de búsqueda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="searchPokemon">
                                    Buscar Pokémon (por nombre o tipo)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="searchPokemon"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="py-3 px-4 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ej. Pikachu, fuego, agua..."
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm('')}
                                            className="absolute inset-y-0 right-0 px-3 flex items-center"
                                        >
                                            <span className="text-gray-400 hover:text-gray-600">×</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Botón de seleccionar todos + Paginación */}
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">
                                    Pokémon Disponibles
                                </label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        disabled={selectedPokemon.length >= 6 && !selectAll}
                                        className={`text-sm px-3 py-1 rounded-md ${
                                            selectAll 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-gray-200 hover:bg-gray-300'
                                        } ${selectedPokemon.length >= 6 && !selectAll ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {selectAll ? 'Deseleccionar' : 'Selec. todos'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Lista de Pokémon filtrados */}
                            <div className="max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                                {loading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-4 text-red-500">
                                        Error: {error}. Por favor, intenta de nuevo.
                                    </div>
                                ) : filteredPokemon.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filteredPokemon.map(pokemon => (
                                            <button
                                                key={pokemon.id}
                                                type="button"
                                                onClick={() => handlePokemonSelect(pokemon)}
                                                disabled={selectedPokemon.length >= 6 && !selectedPokemon.some(p => p.id === pokemon.id)}
                                                className={`p-2 rounded-lg border transition-all flex items-center ${
                                                    selectedPokemon.some(p => p.id === pokemon.id) 
                                                    ? 'bg-green-100 border-green-500' 
                                                    : 'bg-white hover:bg-gray-100 border-gray-200'
                                                } ${selectedPokemon.length >= 6 && !selectedPokemon.some(p => p.id === pokemon.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <img 
                                                    src={pokemon.sprite} 
                                                    alt={pokemon.name} 
                                                    className="w-12 h-12"
                                                />
                                                <div className="ml-2 text-left">
                                                    <div className="font-semibold text-sm">{pokemon.name}</div>
                                                    <div className="flex mt-1 space-x-1">
                                                        {pokemon.types.map(type => (
                                                            <span 
                                                                key={`${pokemon.id}-${type}`} 
                                                                className={`px-2 py-0.5 rounded-full text-white text-xs ${getTypeColor(type)}`}
                                                            >
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="col-span-3 py-4 text-center text-gray-500">
                                        No se encontraron Pokémon con "{searchTerm}"
                                    </div>
                                )}
                            </div>
                            
                            {/* Paginación */}
                            {!searchTerm && (
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || loading}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        &lt;
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || loading}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Equipo Actual ({selectedPokemon.length}/6)
                                </label>
                                <div className="flex flex-wrap gap-2 min-h-16 p-2 border border-gray-200 rounded-lg">
                                    {selectedPokemon.map(pokemon => (
                                        <div 
                                            key={pokemon.id} 
                                            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                                        >
                                            <img 
                                                src={pokemon.sprite} 
                                                alt={pokemon.name} 
                                                className="w-6 h-6 inline-block"
                                            />
                                            <span>{pokemon.name}</span>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemovePokemon(pokemon)}
                                                className="ml-1 text-white hover:text-red-200"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {selectedPokemon.length === 0 && (
                                        <div className="text-gray-400 text-sm flex items-center justify-center w-full h-10">
                                            Selecciona Pokémon para tu equipo
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    disabled={isBuilding || selectedPokemon.length === 0 || !teamName}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                                        isBuilding || selectedPokemon.length === 0 || !teamName
                                        ? 'bg-gray-400'
                                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                                >
                                    {isBuilding ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Creando Equipo...</span>
                                        </>
                                    ) : (
                                        <span>Crear Equipo</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <p className="text-sm text-gray-600">
                            ¿Necesitas ayuda? 
                            <Link to="/help" className="ml-1 font-medium text-red-600 hover:text-red-500">
                                Guía de Equipo
                            </Link>
                        </p>
                        
                        <div className="flex space-x-4">
                            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonTeamBuilder;