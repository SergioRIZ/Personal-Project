import { useState, useEffect, useRef } from 'react';
import type { CollectionItem } from '../lib/collection';

export interface TypeDistributionResult {
  typeCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const BATCH_SIZE = 10;

export function useTypeDistribution(items: CollectionItem[]): TypeDistributionResult {
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ key: string; data: Record<string, number> } | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      setTypeCounts({});
      setLoading(false);
      return;
    }

    // Stable cache key: sorted IDs joined
    const cacheKey = [...items].map(i => i.pokemon_id).sort((a, b) => a - b).join(',');
    if (cacheRef.current?.key === cacheKey) {
      setTypeCounts(cacheRef.current.data);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      const counts: Record<string, number> = {};

      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        if (cancelled) return;
        const batch = items.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map(item =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${item.pokemon_id}`)
              .then(r => r.json())
              .then((d: { types: Array<{ type: { name: string } }> }) =>
                d.types.map(t => t.type.name)
              )
          )
        );
        for (const result of results) {
          if (result.status === 'fulfilled') {
            for (const typeName of result.value) {
              counts[typeName] = (counts[typeName] ?? 0) + 1;
            }
          }
        }
      }

      if (!cancelled) {
        cacheRef.current = { key: cacheKey, data: counts };
        setTypeCounts(counts);
        setLoading(false);
      }
    }

    fetchAll().catch(err => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'Failed to fetch types');
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [items]);

  return { typeCounts, loading, error };
}
