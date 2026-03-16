import type { BaseStats } from '../hooks/usePokemonBaseStats';
import type { EVSpread, IVSpread } from './teams';
import { getNatureModifiers } from './natures';

const STAT_KEYS: (keyof BaseStats)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

export function calcStat(
  stat: keyof BaseStats,
  base: number,
  iv: number,
  ev: number,
  natureMod: number,
  level = 50,
): number {
  const evBonus = Math.floor(ev / 4);
  if (stat === 'hp') {
    if (base === 1) return 1; // Shedinja
    return Math.floor(((2 * base + iv + evBonus) * level) / 100) + level + 10;
  }
  return Math.floor((Math.floor(((2 * base + iv + evBonus) * level) / 100) + 5) * natureMod);
}

export function calcAllStats(
  baseStats: BaseStats,
  nature: string | null,
  evs: EVSpread | null,
  ivs: IVSpread | null,
  level = 50,
): BaseStats {
  const mods = getNatureModifiers(nature);
  const ev = evs ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  const iv = ivs ?? { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

  const result = {} as BaseStats;
  for (const key of STAT_KEYS) {
    result[key] = calcStat(key, baseStats[key], iv[key], ev[key], mods[key], level);
  }
  return result;
}
