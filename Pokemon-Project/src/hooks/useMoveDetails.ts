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
// Track slugs that permanently failed so we don't retry forever
const failedSlugs = new Set<string>();

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

async function fetchMoveDetail(slug: string, retries = 2): Promise<MoveDetail> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/move/${slug}`);
      if (!res.ok) {
        if ((res.status === 429 || res.status >= 500) && attempt < retries) {
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        throw new Error(`Move not found: ${slug}`);
      }
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
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw new Error(`Move not found: ${slug}`);
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
  const runIdRef = useRef(0);

  useEffect(() => {
    const currentRun = ++runIdRef.current;

    if (slugs.length === 0) {
      setDetails({});
      setLoading(false);
      return;
    }

    // Seed state with already-cached entries
    const cached: Record<string, MoveDetail> = {};
    for (const s of slugs) {
      if (moveCache.has(s)) cached[s] = moveCache.get(s)!;
    }
    setDetails(cached);

    const uncached = slugs.filter(s => s && !moveCache.has(s) && !failedSlugs.has(s));

    if (uncached.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const chunks = chunkArray(uncached, 10);

    (async () => {
      for (let i = 0; i < chunks.length; i++) {
        if (runIdRef.current !== currentRun) return;
        if (i > 0) await new Promise(r => setTimeout(r, 200));
        const results = await Promise.allSettled(chunks[i].map(s => fetchMoveDetail(s)));
        if (runIdRef.current !== currentRun) return;
        const newEntries: Record<string, MoveDetail> = {};
        for (let j = 0; j < results.length; j++) {
          const result = results[j];
          if (result.status === 'fulfilled') {
            moveCache.set(result.value.slug, result.value);
            newEntries[result.value.slug] = result.value;
          } else {
            failedSlugs.add(chunks[i][j]);
          }
        }
        setDetails(prev => ({ ...prev, ...newEntries }));
      }
      if (runIdRef.current === currentRun) setLoading(false);
    })();
  }, [slugs.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { details, loading };
}
