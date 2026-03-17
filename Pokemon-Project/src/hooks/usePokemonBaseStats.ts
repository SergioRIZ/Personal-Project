import { useState, useEffect } from 'react';

export interface BaseStats {
  hp: number; atk: number; def: number;
  spa: number; spd: number; spe: number;
}

// Module-level cache — survives component remounts, shared with useTeamBaseStats
// Keyed by "formName" or "pokemonId" to avoid collisions between forms sharing the same ID
export const statsCache = new Map<string, BaseStats>();

const STAT_MAP: Record<string, keyof BaseStats> = {
  'hp':               'hp',
  'attack':           'atk',
  'defense':          'def',
  'special-attack':   'spa',
  'special-defense':  'spd',
  'speed':            'spe',
};

// Strip parentheses from stored names like "urshifu-(rapid-strike)" → "urshifu-rapid-strike"
function sanitizeName(name: string): string {
  return name.replace(/[()]/g, '');
}

async function fetchPokemonData(pokemonId: number, pokemonName?: string): Promise<Response> {
  if (pokemonName) {
    const clean = sanitizeName(pokemonName);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${clean}`);
    if (res.ok) return res;
    // Name failed — fall back to numeric ID
  }
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
}

export async function fetchBaseStats(pokemonId: number, pokemonName?: string): Promise<BaseStats> {
  const cacheKey = pokemonName ?? String(pokemonId);
  if (statsCache.has(cacheKey)) return statsCache.get(cacheKey)!;
  const res = await fetchPokemonData(pokemonId, pokemonName);
  const data: { stats: Array<{ base_stat: number; stat: { name: string } }> } = await res.json();
  const base: BaseStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  for (const s of data.stats) {
    const key = STAT_MAP[s.stat.name];
    if (key) base[key] = s.base_stat;
  }
  statsCache.set(cacheKey, base);
  return base;
}

export function usePokemonBaseStats(pokemonId: number | null, pokemonName?: string): {
  stats: BaseStats | null;
  loading: boolean;
} {
  const cacheKey = pokemonName ?? (pokemonId != null ? String(pokemonId) : null);

  const [stats, setStats] = useState<BaseStats | null>(
    cacheKey != null ? (statsCache.get(cacheKey) ?? null) : null
  );
  const [loading, setLoading] = useState(
    cacheKey != null && !statsCache.has(cacheKey)
  );

  useEffect(() => {
    if (pokemonId === null || cacheKey === null) return;
    if (statsCache.has(cacheKey)) {
      setStats(statsCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchPokemonData(pokemonId, pokemonName)
      .then(r => r.json())
      .then((data: { stats: Array<{ base_stat: number; stat: { name: string } }> }) => {
        if (cancelled) return;
        const base: BaseStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        for (const s of data.stats) {
          const key = STAT_MAP[s.stat.name];
          if (key) base[key] = s.base_stat;
        }
        statsCache.set(cacheKey, base);
        setStats(base);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [pokemonId, pokemonName, cacheKey]);

  return { stats, loading };
}
