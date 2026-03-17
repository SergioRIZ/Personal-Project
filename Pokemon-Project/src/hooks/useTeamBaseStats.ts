import { useState, useEffect, useRef } from 'react';
import type { BaseStats } from './usePokemonBaseStats';
import { statsCache, fetchBaseStats } from './usePokemonBaseStats';

export function useTeamBaseStats(pokemonIds: number[]): {
  statsMap: Record<number, BaseStats>;
  loading: boolean;
} {
  const [statsMap, setStatsMap] = useState<Record<number, BaseStats>>({});
  const [loading, setLoading] = useState(false);
  const runRef = useRef(0);

  useEffect(() => {
    const currentRun = ++runRef.current;

    if (pokemonIds.length === 0) {
      setStatsMap({});
      setLoading(false);
      return;
    }

    // Seed with cached entries
    const cached: Record<number, BaseStats> = {};
    for (const id of pokemonIds) {
      if (statsCache.has(String(id))) cached[id] = statsCache.get(String(id))!;
    }
    setStatsMap(cached);

    const uncached = pokemonIds.filter(id => !statsCache.has(String(id)));
    if (uncached.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      const results = await Promise.allSettled(uncached.map(id => fetchBaseStats(id)));
      if (runRef.current !== currentRun) return;

      const newEntries: Record<number, BaseStats> = {};
      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 'fulfilled') {
          newEntries[uncached[i]] = (results[i] as PromiseFulfilledResult<BaseStats>).value;
        }
      }
      setStatsMap(prev => ({ ...prev, ...newEntries }));
      setLoading(false);
    })();
  }, [pokemonIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { statsMap, loading };
}
