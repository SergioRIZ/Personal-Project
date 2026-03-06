import type { PokemonBasic, PokemonData } from './ApiService';

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
): Promise<PokemonData[]> => {
  if (!searchTerm || searchTerm.length < 1) return [];

  const normalizedTerm = searchTerm.toLowerCase();

  const matchingPokemon = allPokemon.filter(
    pokemon =>
      pokemon.name.includes(normalizedTerm) ||
      pokemon.id.toString().includes(normalizedTerm)
  );

  const limitedResults = matchingPokemon.slice(0, 24);
  let completed = 0;

  const promises = limitedResults.map(pokemon =>
    fetch(pokemon.url)
      .then(r => r.json())
      .finally(() => {
        completed++;
        setLoadingProgress(Math.floor((completed / limitedResults.length) * 100));
      })
  );

  const results = await Promise.allSettled(promises);
  return results
    .filter((r): r is PromiseFulfilledResult<PokemonData> => r.status === 'fulfilled')
    .map(r => r.value);
};
