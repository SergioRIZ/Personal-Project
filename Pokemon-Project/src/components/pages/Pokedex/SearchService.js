// Funciones para gestionar la búsqueda bajo demanda

// Función para obtener datos básicos de todos los Pokémon (nombres e IDs)
export const fetchPokemonBasicData = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1267');
    const data = await response.json();
    
    // Extraer id del url y combinarlo con el nombre
    return data.results.map(pokemon => {
      const urlParts = pokemon.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2]);
      return {
        id,
        name: pokemon.name,
        url: pokemon.url
      };
    }).sort((a, b) => a.id - b.id);
  };
  
  // Función para buscar Pokémon según el término de búsqueda
  export const searchPokemonByTerm = async (allPokemon, searchTerm, setLoadingProgress) => {
    // Si el término de búsqueda está vacío o es muy corto, no cargar nada
    if (!searchTerm || searchTerm.length < 1) {
      return [];
    }
    
    // Normalizar el término de búsqueda (minúsculas)
    const normalizedTerm = searchTerm.toLowerCase();
    
    // Filtrar por nombre o ID
    const matchingPokemon = allPokemon.filter(pokemon => 
      pokemon.name.includes(normalizedTerm) || 
      pokemon.id.toString().includes(normalizedTerm)
    );
    
    // Si hay demasiados resultados, limitar la cantidad para evitar sobrecarga
    const maxResults = 24; // Número razonable para mostrar
    const limitedResults = matchingPokemon.length > maxResults 
      ? matchingPokemon.slice(0, maxResults) 
      : matchingPokemon;
      
    // Obtener detalles completos de los Pokémon coincidentes
    const pokemonDetails = [];
    
    // Mostrar progreso de carga
    for (let i = 0; i < limitedResults.length; i++) {
      try {
        const response = await fetch(limitedResults[i].url);
        const data = await response.json();
        pokemonDetails.push(data);
        
        // Actualizar progreso de carga
        setLoadingProgress(Math.floor(((i + 1) / limitedResults.length) * 100));
      } catch (error) {
        console.error(`Error fetching Pokémon ${limitedResults[i].name}:`, error);
      }
    }
    
    return pokemonDetails;
  };