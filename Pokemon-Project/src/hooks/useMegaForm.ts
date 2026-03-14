import { useState, useEffect } from 'react';
import type { BaseStats } from './usePokemonBaseStats';

export interface MegaFormData {
  spriteId: number;   // PokeAPI numeric ID for sprites (e.g. 10034 for charizard-mega-x)
  baseStats: BaseStats;
  types: string[];
  ability: string;
}

const megaCache = new Map<string, MegaFormData>();

/**
 * Fetches mega form data (base stats, types, ability, spriteId) from PokeAPI
 * using the form name (e.g. "charizard-mega-x").
 */
export function useMegaForm(megaFormName: string | null): {
  megaData: MegaFormData | null;
  loading: boolean;
} {
  const [data, setData] = useState<MegaFormData | null>(
    megaFormName ? (megaCache.get(megaFormName) ?? null) : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!megaFormName) {
      setData(null);
      return;
    }

    if (megaCache.has(megaFormName)) {
      setData(megaCache.get(megaFormName)!);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon/${megaFormName}`)
      .then(r => r.json())
      .then((d: {
        id: number;
        stats: Array<{ base_stat: number; stat: { name: string } }>;
        types: Array<{ type: { name: string } }>;
        abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
      }) => {
        if (cancelled) return;

        const statMap: Record<string, keyof BaseStats> = {
          hp: 'hp', attack: 'atk', defense: 'def',
          'special-attack': 'spa', 'special-defense': 'spd', speed: 'spe',
        };

        const baseStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } as BaseStats;
        for (const s of d.stats) {
          const key = statMap[s.stat.name];
          if (key) baseStats[key] = s.base_stat;
        }

        const result: MegaFormData = {
          spriteId: d.id,
          baseStats,
          types: d.types.map(t => t.type.name),
          ability: d.abilities.find(a => !a.is_hidden)?.ability.name ?? d.abilities[0]?.ability.name ?? '',
        };

        megaCache.set(megaFormName, result);
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [megaFormName]);

  return { megaData: data, loading };
}
