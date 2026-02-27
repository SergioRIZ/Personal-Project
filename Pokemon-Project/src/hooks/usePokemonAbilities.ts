import { useState, useEffect } from 'react';

export interface PokemonAbility {
  slug: string;
  name: string;
  shortEffect: string;
  isHidden: boolean;
}

// Module-level caches — survive remounts
const pokemonAbilityListCache = new Map<number, { slug: string; isHidden: boolean }[]>();
const abilityDetailCache = new Map<string, { name: string; shortEffect: string }>();

function formatSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function fetchAbilityDetail(slug: string): Promise<{ name: string; shortEffect: string }> {
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${slug}`);
  if (!res.ok) throw new Error(`Ability not found: ${slug}`);
  const data = await res.json() as {
    names: Array<{ name: string; language: { name: string } }>;
    effect_entries: Array<{ short_effect: string; language: { name: string } }>;
  };
  const enName = data.names?.find(n => n.language.name === 'en')?.name ?? formatSlug(slug);
  const enEntry = data.effect_entries?.find(e => e.language.name === 'en');
  return { name: enName, shortEffect: enEntry?.short_effect ?? '' };
}

export function usePokemonAbilities(pokemonId: number | null): {
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

      // Step 1 — ability slug list for this Pokémon
      let list: { slug: string; isHidden: boolean }[];
      if (pokemonAbilityListCache.has(pokemonId!)) {
        list = pokemonAbilityListCache.get(pokemonId!)!;
      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await res.json() as {
          abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
        };
        list = data.abilities.map(a => ({ slug: a.ability.name, isHidden: a.is_hidden }));
        pokemonAbilityListCache.set(pokemonId!, list);
      }

      if (cancelled) return;

      // Step 2 — fetch details for each ability
      const results = await Promise.allSettled(
        list.map(async ({ slug, isHidden }) => {
          let detail: { name: string; shortEffect: string };
          if (abilityDetailCache.has(slug)) {
            detail = abilityDetailCache.get(slug)!;
          } else {
            detail = await fetchAbilityDetail(slug);
            abilityDetailCache.set(slug, detail);
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
  }, [pokemonId]);

  return { abilities, loading };
}
