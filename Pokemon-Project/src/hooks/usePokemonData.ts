import { useState, useEffect } from 'react';
import { usePokemonBaseStats, type BaseStats } from './usePokemonBaseStats';
import { usePokemonAbilities, type PokemonAbility } from './usePokemonAbilities';

export interface PokemonFullData {
  id: number;
  name: string;
  types: string[];
  baseStats: BaseStats;
  abilities: PokemonAbility[];
  moves: string[];
}

// Module-level cache for types + moves (lightweight data)
const CACHE_MAX = 200;
const pokemonMetaCache = new Map<number, { name: string; types: string[]; moves: string[] }>();

function setMetaCache(id: number, val: { name: string; types: string[]; moves: string[] }) {
  if (pokemonMetaCache.size >= CACHE_MAX) {
    const firstKey = pokemonMetaCache.keys().next().value!;
    pokemonMetaCache.delete(firstKey);
  }
  pokemonMetaCache.set(id, val);
}

export function usePokemonData(pokemonId: number | null, lang = 'en'): {
  data: PokemonFullData | null;
  loading: boolean;
} {
  const { stats: baseStats, loading: statsLoading } = usePokemonBaseStats(pokemonId);
  const { abilities, loading: abilitiesLoading } = usePokemonAbilities(pokemonId, lang);

  const [meta, setMeta] = useState<{ name: string; types: string[]; moves: string[] } | null>(
    pokemonId != null ? (pokemonMetaCache.get(pokemonId) ?? null) : null,
  );
  const [metaLoading, setMetaLoading] = useState(pokemonId != null && !pokemonMetaCache.has(pokemonId!));

  useEffect(() => {
    if (pokemonId === null) { setMeta(null); return; }
    if (pokemonMetaCache.has(pokemonId)) {
      setMeta(pokemonMetaCache.get(pokemonId)!);
      setMetaLoading(false);
      return;
    }

    let cancelled = false;
    setMetaLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(r => r.json())
      .then((data: {
        name: string;
        types: Array<{ type: { name: string } }>;
        moves: Array<{ move: { name: string } }>;
      }) => {
        if (cancelled) return;
        const val = {
          name: data.name,
          types: data.types.map(t => t.type.name),
          moves: [...new Set(data.moves.map(m => m.move.name))].sort(),
        };
        setMetaCache(pokemonId, val);
        setMeta(val);
        setMetaLoading(false);
      })
      .catch(() => { if (!cancelled) setMetaLoading(false); });

    return () => { cancelled = true; };
  }, [pokemonId]);

  const loading = statsLoading || abilitiesLoading || metaLoading;

  if (!pokemonId || !baseStats || !meta) {
    return { data: null, loading };
  }

  return {
    data: {
      id: pokemonId,
      name: meta.name,
      types: meta.types,
      baseStats,
      abilities,
      moves: meta.moves,
    },
    loading,
  };
}
