import { useState, useEffect } from 'react';

export interface BaseStats {
  hp: number; atk: number; def: number;
  spa: number; spd: number; spe: number;
}

// Module-level cache — survives component remounts, shared with useTeamBaseStats
export const statsCache = new Map<number, BaseStats>();

const STAT_MAP: Record<string, keyof BaseStats> = {
  'hp':               'hp',
  'attack':           'atk',
  'defense':          'def',
  'special-attack':   'spa',
  'special-defense':  'spd',
  'speed':            'spe',
};

export async function fetchBaseStats(pokemonId: number): Promise<BaseStats> {
  if (statsCache.has(pokemonId)) return statsCache.get(pokemonId)!;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data: { stats: Array<{ base_stat: number; stat: { name: string } }> } = await res.json();
  const base: BaseStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  for (const s of data.stats) {
    const key = STAT_MAP[s.stat.name];
    if (key) base[key] = s.base_stat;
  }
  statsCache.set(pokemonId, base);
  return base;
}

export function usePokemonBaseStats(pokemonId: number | null): {
  stats: BaseStats | null;
  loading: boolean;
} {
  const [stats, setStats] = useState<BaseStats | null>(
    pokemonId != null ? (statsCache.get(pokemonId) ?? null) : null
  );
  const [loading, setLoading] = useState(
    pokemonId != null && !statsCache.has(pokemonId)
  );

  useEffect(() => {
    if (pokemonId === null) return;
    if (statsCache.has(pokemonId)) {
      setStats(statsCache.get(pokemonId)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(r => r.json())
      .then((data: { stats: Array<{ base_stat: number; stat: { name: string } }> }) => {
        if (cancelled) return;
        const base: BaseStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        for (const s of data.stats) {
          const key = STAT_MAP[s.stat.name];
          if (key) base[key] = s.base_stat;
        }
        statsCache.set(pokemonId, base);
        setStats(base);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [pokemonId]);

  return { stats, loading };
}
