// Función para obtener la lista de Pokémon con detalles
export const fetchPokemonList = async (setLoadingProgress) => {
    // Obtenemos la lista completa de Pokémon
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
    return allPokemonDetails.sort((a, b) => a.id - b.id);
  };
  
  // Función para obtener descripciones de las habilidades
  export const fetchAbilityDescriptions = async (pokemonList, currentLanguage) => {
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
    
    return abilityDetails;
  };