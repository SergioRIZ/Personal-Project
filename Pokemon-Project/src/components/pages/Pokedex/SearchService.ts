import i18next from 'i18next';
import type { PokemonBasic, PokemonData } from './ApiService';
import { PARADOX_POKEMON } from '../../../lib/paradoxData';
import { MEGA_FORMS } from '../../../lib/megaData';
import { REGIONAL_FORMS } from '../../../lib/regionalData';
import { GMAX_FORMS } from '../../../lib/gmaxData';
import { ALT_FORMS } from '../../../lib/altFormsData';

/**
 * Build a lookup: PokeAPI form name → { labelEn, labelEs }
 * so we can assign displayName to entries from the pokemon endpoint.
 */
function buildFormNameMap(): Map<string, { en: string; es: string }> {
  const map = new Map<string, { en: string; es: string }>();

  for (const forms of Object.values(MEGA_FORMS)) {
    for (const f of forms) map.set(f.name, { en: f.label, es: f.labelEs });
  }
  for (const forms of Object.values(REGIONAL_FORMS)) {
    for (const f of forms) map.set(f.name, { en: f.label, es: f.labelEs });
  }
  for (const forms of Object.values(GMAX_FORMS)) {
    for (const f of forms) map.set(f.name, { en: f.label, es: f.labelEs });
  }
  for (const forms of Object.values(ALT_FORMS)) {
    for (const f of forms) map.set(f.name, { en: f.label, es: f.labelEs });
  }

  return map;
}

const formNameMap = buildFormNameMap();

export const fetchPokemonBasicData = async (): Promise<PokemonBasic[]> => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1267');
  const data = await response.json();
  const es = i18next.language?.startsWith('es') ?? false;

  return (data.results as Array<{ name: string; url: string }>)
    .map(pokemon => {
      const urlParts = pokemon.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2]);

      // Check paradox names first (by ID), then form names (by PokeAPI name)
      const paradox = PARADOX_POKEMON[id];
      const formEntry = formNameMap.get(pokemon.name);

      let displayName: string | undefined;
      if (paradox) {
        displayName = es ? paradox.nameEs : paradox.nameEn;
      } else if (formEntry) {
        displayName = es ? formEntry.es : formEntry.en;
      }

      return {
        id,
        name: pokemon.name,
        displayName,
        url: pokemon.url,
      };
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
      pokemon.id.toString().includes(normalizedTerm) ||
      (pokemon.displayName && pokemon.displayName.toLowerCase().includes(normalizedTerm))
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
