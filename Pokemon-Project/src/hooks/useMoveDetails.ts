import { useState, useEffect, useRef } from 'react';

export interface MoveDetail {
  slug: string;
  type: string;
  power: number | null;
  damageClass: 'physical' | 'special' | 'status';
  shortEffect: string;
}

// Module-level cache — survives component remounts
const moveCache = new Map<string, MoveDetail>();

interface PokeApiMoveResponse {
  name: string;
  power: number | null;
  effect_chance: number | null;
  type: { name: string };
  damage_class: { name: string };
  effect_entries: Array<{
    short_effect: string;
    language: { name: string };
  }>;
}

async function fetchMoveDetail(slug: string): Promise<MoveDetail> {
  const res = await fetch(`https://pokeapi.co/api/v2/move/${slug}`);
  if (!res.ok) throw new Error(`Move not found: ${slug}`);
  const data: PokeApiMoveResponse = await res.json();
  const enEntry = data.effect_entries.find(e => e.language.name === 'en');
  const rawEffect = enEntry?.short_effect ?? '';
  const shortEffect = data.effect_chance
    ? rawEffect.replace(/\$effect_chance/g, String(data.effect_chance))
    : rawEffect.replace(/\$effect_chance%\s?/g, '').trim();
  return {
    slug,
    type: data.type.name,
    power: data.power ?? null,
    damageClass: (data.damage_class.name as MoveDetail['damageClass']) ?? 'status',
    shortEffect,
  };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export function useMoveDetails(slugs: string[]): {
  details: Record<string, MoveDetail>;
  loading: boolean;
} {
  const [details, setDetails] = useState<Record<string, MoveDetail>>({});
  const [loading, setLoading] = useState(false);
  const prevKeyRef = useRef<string>('');
  const abortRef = useRef(false);

  useEffect(() => {
    const key = slugs.slice().sort().join(',');
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;
    abortRef.current = false;

    if (slugs.length === 0) {
      setDetails({});
      setLoading(false);
      return;
    }

    const uncached = slugs.filter(s => s && !moveCache.has(s));

    // Seed state with already-cached entries immediately
    const cached: Record<string, MoveDetail> = {};
    for (const s of slugs) {
      if (moveCache.has(s)) cached[s] = moveCache.get(s)!;
    }
    setDetails(cached);

    if (uncached.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const chunks = chunkArray(uncached, 10);

    (async () => {
      for (const chunk of chunks) {
        if (abortRef.current) break;
        const results = await Promise.allSettled(chunk.map(fetchMoveDetail));
        if (abortRef.current) break;
        const newEntries: Record<string, MoveDetail> = {};
        for (const result of results) {
          if (result.status === 'fulfilled') {
            moveCache.set(result.value.slug, result.value);
            newEntries[result.value.slug] = result.value;
          }
        }
        setDetails(prev => ({ ...prev, ...newEntries }));
      }
      if (!abortRef.current) setLoading(false);
    })();

    return () => { abortRef.current = true; };
  }, [slugs.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { details, loading };
}
