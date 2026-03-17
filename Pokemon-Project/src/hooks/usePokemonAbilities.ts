import { useState, useEffect } from 'react';

export interface PokemonAbility {
  slug: string;
  name: string;
  shortEffect: string;
  isHidden: boolean;
}

// Module-level caches — survive remounts, keyed by `lang:slug` (capped)
const CACHE_MAX = 300;
const pokemonAbilityListCache = new Map<string, { slug: string; isHidden: boolean }[]>();
const abilityDetailCache = new Map<string, { name: string; shortEffect: string }>();

function setAbilityCache(key: string, value: { name: string; shortEffect: string }) {
  if (abilityDetailCache.size >= CACHE_MAX) {
    const firstKey = abilityDetailCache.keys().next().value!;
    abilityDetailCache.delete(firstKey);
  }
  abilityDetailCache.set(key, value);
}

function formatSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function fetchAbilityDetail(slug: string, lang: string): Promise<{ name: string; shortEffect: string }> {
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${slug}`);
  if (!res.ok) throw new Error(`Ability not found: ${slug}`);
  const data = await res.json() as {
    names: Array<{ name: string; language: { name: string } }>;
    effect_entries: Array<{ short_effect: string; language: { name: string } }>;
    flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>;
  };
  const localName = data.names?.find(n => n.language.name === lang)?.name
    ?? data.names?.find(n => n.language.name === 'en')?.name
    ?? formatSlug(slug);
  const localEffect = data.effect_entries?.find(e => e.language.name === lang)?.short_effect
    ?? data.flavor_text_entries?.filter(f => f.language.name === lang).pop()?.flavor_text
    ?? data.effect_entries?.find(e => e.language.name === 'en')?.short_effect
    ?? data.flavor_text_entries?.filter(f => f.language.name === 'en').pop()?.flavor_text
    ?? '';
  return { name: localName, shortEffect: localEffect.replace(/[\n\f\r]+/g, ' ').trim() };
}

export function usePokemonAbilities(pokemonId: number | null, lang = 'en', pokemonName?: string): {
  abilities: PokemonAbility[];
  loading: boolean;
} {
  const [abilities, setAbilities] = useState<PokemonAbility[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pokemonId === null) return;
    let cancelled = false;

    async function load() {
      setLoading(true);

      // Step 1 — ability slug list for this Pokémon (use form name if available)
      const cacheKey = pokemonName ?? String(pokemonId!);
      let list: { slug: string; isHidden: boolean }[];
      if (pokemonAbilityListCache.has(cacheKey)) {
        list = pokemonAbilityListCache.get(cacheKey)!;
      } else {
        let res: Response;
        if (pokemonName) {
          const clean = pokemonName.replace(/[()]/g, '');
          res = await fetch(`https://pokeapi.co/api/v2/pokemon/${clean}`);
          if (!res.ok) res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId!}`);
        } else {
          res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId!}`);
        }
        const data = await res.json() as {
          abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
        };
        list = data.abilities.map(a => ({ slug: a.ability.name, isHidden: a.is_hidden }));
        pokemonAbilityListCache.set(cacheKey, list);
      }

      if (cancelled) return;

      // Step 2 — fetch details for each ability (language-aware)
      const results = await Promise.allSettled(
        list.map(async ({ slug, isHidden }) => {
          const cacheKey = `${lang}:${slug}`;
          let detail: { name: string; shortEffect: string };
          if (abilityDetailCache.has(cacheKey)) {
            detail = abilityDetailCache.get(cacheKey)!;
          } else {
            detail = await fetchAbilityDetail(slug, lang);
            setAbilityCache(cacheKey, detail);
          }
          return { slug, name: detail.name, shortEffect: detail.shortEffect, isHidden } as PokemonAbility;
        })
      );

      if (cancelled) return;

      const resolved: PokemonAbility[] = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<PokemonAbility>).value);

      setAbilities(resolved);
      setLoading(false);
    }

    load().catch(console.error);
    return () => { cancelled = true; };
  }, [pokemonId, lang, pokemonName]);

  return { abilities, loading };
}
