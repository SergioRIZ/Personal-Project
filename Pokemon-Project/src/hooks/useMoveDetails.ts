import { useState, useEffect, useMemo, useRef } from 'react';

export interface MoveDetail {
  slug: string;
  name: string;
  type: string;
  power: number | null;
  damageClass: 'physical' | 'special' | 'status';
  shortEffect: string;
}

// Module-level cache — keyed by `lang:slug` (capped at 500 entries)
const CACHE_MAX = 500;
const moveCache = new Map<string, MoveDetail>();
// Track slugs that permanently failed so we don't retry forever
const failedSlugs = new Set<string>();

function setCached(key: string, value: MoveDetail) {
  if (moveCache.size >= CACHE_MAX) {
    const firstKey = moveCache.keys().next().value!;
    moveCache.delete(firstKey);
  }
  moveCache.set(key, value);
}

interface PokeApiMoveResponse {
  name: string;
  power: number | null;
  effect_chance: number | null;
  type: { name: string };
  damage_class: { name: string };
  names: Array<{ name: string; language: { name: string } }>;
  effect_entries: Array<{
    short_effect: string;
    language: { name: string };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}

function formatSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function fetchMoveDetail(slug: string, lang: string, retries = 2): Promise<MoveDetail> {
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

      // Localized name with English fallback
      const localName = data.names?.find(n => n.language.name === lang)?.name
        ?? data.names?.find(n => n.language.name === 'en')?.name
        ?? formatSlug(slug);

      // Localized effect with English fallback
      const localEffect = data.effect_entries?.find(e => e.language.name === lang)?.short_effect
        ?? data.flavor_text_entries?.filter(f => f.language.name === lang).pop()?.flavor_text
        ?? data.effect_entries?.find(e => e.language.name === 'en')?.short_effect
        ?? data.flavor_text_entries?.filter(f => f.language.name === 'en').pop()?.flavor_text
        ?? '';
      const cleaned = localEffect.replace(/[\n\f\r]+/g, ' ').trim();
      const shortEffect = data.effect_chance
        ? cleaned.replace(/\$effect_chance/g, String(data.effect_chance))
        : cleaned.replace(/\$effect_chance%\s?/g, '').trim();

      return {
        slug,
        name: localName,
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

export function useMoveDetails(slugs: string[], lang = 'en'): {
  details: Record<string, MoveDetail>;
  loading: boolean;
} {
  const [details, setDetails] = useState<Record<string, MoveDetail>>({});
  const [loading, setLoading] = useState(false);
  const runIdRef = useRef(0);
  const slugsKey = useMemo(() => slugs.filter(Boolean).sort().join(','), [slugs]);

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
      const key = `${lang}:${s}`;
      if (moveCache.has(key)) cached[s] = moveCache.get(key)!;
    }
    setDetails(cached);

    const uncached = slugs.filter(s => s && !moveCache.has(`${lang}:${s}`) && !failedSlugs.has(s));

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
        const results = await Promise.allSettled(chunks[i].map(s => fetchMoveDetail(s, lang)));
        if (runIdRef.current !== currentRun) return;
        const newEntries: Record<string, MoveDetail> = {};
        for (let j = 0; j < results.length; j++) {
          const result = results[j];
          if (result.status === 'fulfilled') {
            const key = `${lang}:${result.value.slug}`;
            setCached(key, result.value);
            newEntries[result.value.slug] = result.value;
          } else {
            failedSlugs.add(chunks[i][j]);
          }
        }
        setDetails(prev => ({ ...prev, ...newEntries }));
      }
      if (runIdRef.current === currentRun) setLoading(false);
    })();
  }, [slugsKey, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return { details, loading };
}
