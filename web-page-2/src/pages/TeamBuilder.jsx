import React, { useState } from 'react';
import { Link } from '../Link';

const PokemonTeamBuilder = () => {
    const [teamName, setTeamName] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);

    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    const handlePokemonSelect = (pokemon) => {
        if (selectedPokemon.length < 6 && !selectedPokemon.includes(pokemon)) {
            setSelectedPokemon([...selectedPokemon, pokemon]);
        }
    };

    const handleRemovePokemon = (pokemon) => {
        setSelectedPokemon(selectedPokemon.filter(p => p !== pokemon));
    };

    const availablePokemon = [
        'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 
        'Gengar', 'Dragonite', 'Mewtwo', 'Lucario'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (teamName && selectedPokemon.length > 0) {
            setIsBuilding(true);
            // Simulate team creation process
            setTimeout(() => {
                alert(`Team "${teamName}" created successfully!`);
                setIsBuilding(false);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 p-4">
            {/* Header con logotipo */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                    <div className="w-16 h-16 bg-gradient-to-b from-red-500 to-red-600 rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full border-2 border-black"></div>
                        </div>
                        <div className="absolute w-full h-2 bg-black top-1/2 -mt-1"></div>
                    </div>
                </div>
                <h1 className="text-5xl font-bold text-white mb-2 text-shadow">Liga Pokémon</h1>
                <p className="text-white text-lg text-shadow">Construye tu equipo de entrenadores</p>
            </div>
            
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-102">
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
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pokémon Disponibles
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {availablePokemon.map(pokemon => (
                                        <button
                                            key={pokemon}
                                            type="button"
                                            onClick={() => handlePokemonSelect(pokemon)}
                                            disabled={selectedPokemon.length >= 6}
                                            className={`py-2 px-2 text-xs rounded-md ${
                                                selectedPokemon.includes(pokemon) 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-200 hover:bg-gray-300'
                                            } ${selectedPokemon.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {pokemon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Equipo Actual ({selectedPokemon.length}/6)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPokemon.map(pokemon => (
                                        <div 
                                            key={pokemon} 
                                            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                                        >
                                            {pokemon}
                                            <button 
                                                type="button"
                                                onClick={() => handleRemovePokemon(pokemon)}
                                                className="ml-2 text-white hover:text-red-200"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    disabled={isBuilding || selectedPokemon.length === 0 || !teamName}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                                        isBuilding ? 'bg-gray-400' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
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
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ayuda
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-6 text-sm text-white">
                    <p>© {new Date().getFullYear()} Liga Pokémon. Todos los derechos reservados.</p>
                    <p className="mt-1">Diseñado para entrenadores de todas las regiones.</p>
                </div>
            </div>
        </div>
    );
};

export default PokemonTeamBuilder;