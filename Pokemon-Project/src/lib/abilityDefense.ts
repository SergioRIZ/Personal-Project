import type { PokemonType } from './typeChart';
import { computeDefensiveMultiplier } from './typeChart';

export interface AbilityDefenseModifier {
  immunities?: PokemonType[];
  halfDamage?: PokemonType[];
  extraWeakness?: PokemonType[];
}

/** Abilities that modify type-based defensive matchups */
export const ABILITY_DEFENSE_MAP: Record<string, AbilityDefenseModifier> = {
  // Full immunities
  'levitate':        { immunities: ['ground'] },
  'flash-fire':      { immunities: ['fire'] },
  'lightning-rod':   { immunities: ['electric'] },
  'water-absorb':    { immunities: ['water'] },
  'volt-absorb':     { immunities: ['electric'] },
  'storm-drain':     { immunities: ['water'] },
  'sap-sipper':      { immunities: ['grass'] },
  'motor-drive':     { immunities: ['electric'] },
  'earth-eater':     { immunities: ['ground'] },
  'well-baked-body': { immunities: ['fire'] },
  'wind-rider':      { immunities: ['flying'] },
  // Partial reductions
  'thick-fat':       { halfDamage: ['fire', 'ice'] },
  'heatproof':       { halfDamage: ['fire'] },
  'water-bubble':    { halfDamage: ['fire'] },
  'purifying-salt':  { halfDamage: ['ghost'] },
  'ice-scales':      { halfDamage: [] }, // halves special damage, can't represent by type
  // Mixed
  'dry-skin':        { immunities: ['water'], extraWeakness: ['fire'] },
  'fluffy':          { halfDamage: [], extraWeakness: ['fire'] }, // halves contact, weak to fire
};

/**
 * Compute the effective defensive multiplier for a member taking an attack,
 * considering their types AND their ability.
 */
export function abilityAdjustedMultiplier(
  attackType: PokemonType,
  defenderTypes: string[],
  ability: string | null,
): number {
  let mult = computeDefensiveMultiplier(attackType, defenderTypes);

  if (!ability) return mult;
  const mod = ABILITY_DEFENSE_MAP[ability];
  if (!mod) return mult;

  // Ability-granted immunity overrides everything
  if (mod.immunities?.includes(attackType)) return 0;

  // Half damage
  if (mod.halfDamage?.includes(attackType)) mult *= 0.5;

  // Extra weakness (e.g. Dry Skin + Fire = 1.25x extra)
  if (mod.extraWeakness?.includes(attackType)) mult *= 1.25;

  return mult;
}
