import { useState, useEffect } from 'react';
import { MEGA_FORMS } from '../lib/megaData';

export interface PokemonEntry {
  id: number;
  name: string;
  megaForm?: string;   // e.g. "charizard-mega-x" — if set, this is a mega entry
  displayName?: string; // e.g. "Mega Charizard X"
}

let allPokemonCache: PokemonEntry[] | null = null;

async function fetchAllPokemon(): Promise<PokemonEntry[]> {
  if (allPokemonCache) return allPokemonCache;
  const res = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1025');
  const data = await res.json() as { results: Array<{ name: string }> };

  const entries: PokemonEntry[] = [];
  data.results.forEach((p, i) => {
    const id = i + 1;
    entries.push({ id, name: p.name });

    // Add mega forms as separate entries
    const megas = MEGA_FORMS[id];
    if (megas) {
      for (const mega of megas) {
        entries.push({
          id,
          name: p.name,
          megaForm: mega.name,
          displayName: mega.label,
        });
      }
    }
  });

  allPokemonCache = entries;
  return allPokemonCache;
}

export function usePokemonSearch() {
  const [allPokemon, setAllPokemon] = useState<PokemonEntry[]>(allPokemonCache ?? []);
  const [loading, setLoading] = useState(!allPokemonCache);

  useEffect(() => {
    if (allPokemonCache) { setAllPokemon(allPokemonCache); setLoading(false); return; }
    fetchAllPokemon()
      .then(list => { setAllPokemon(list); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { allPokemon, loading };
}
