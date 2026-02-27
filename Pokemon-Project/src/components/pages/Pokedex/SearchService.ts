import type { PokemonBasic } from './ApiService';

export const fetchPokemonBasicData = async (): Promise<PokemonBasic[]> => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1267');
  const data = await response.json();

  return (data.results as Array<{ name: string; url: string }>)
    .map(pokemon => {
      const urlParts = pokemon.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2]);
      return { id, name: pokemon.name, url: pokemon.url };
    })
    .sort((a, b) => a.id - b.id);
};

export const searchPokemonByTerm = async (
  allPokemon: PokemonBasic[],
  searchTerm: string,
  setLoadingProgress: (progress: number) => void
): Promise<unknown[]> => {
  if (!searchTerm || searchTerm.length < 1) return [];

  const normalizedTerm = searchTerm.toLowerCase();

  const matchingPokemon = allPokemon.filter(
    pokemon =>
      pokemon.name.includes(normalizedTerm) ||
      pokemon.id.toString().includes(normalizedTerm)
  );

  const limitedResults = matchingPokemon.slice(0, 24);
  const pokemonDetails: unknown[] = [];

  for (let i = 0; i < limitedResults.length; i++) {
    try {
      const response = await fetch(limitedResults[i].url);
      const data = await response.json();
      pokemonDetails.push(data);
      setLoadingProgress(Math.floor(((i + 1) / limitedResults.length) * 100));
    } catch {
      // Skip Pokemon that fail to load
    }
  }

  return pokemonDetails;
};
