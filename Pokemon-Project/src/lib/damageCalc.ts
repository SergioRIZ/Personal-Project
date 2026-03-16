import { TYPE_CHART, type PokemonType } from './typeChart';
import { getNatureModifiers } from './natures';
import type { BaseStats } from '../hooks/usePokemonBaseStats';

/* ── Interfaces ─────────────────────────────────────────────────────── */

export interface CalcPokemon {
  types: string[];
  baseStats: BaseStats;
  evs: Record<keyof BaseStats, number>;
  ivs: Record<keyof BaseStats, number>;
  nature: string | null;
  ability: string | null;
  item: string | null;
  level: number;
  teraType: string | null;
  currentHPPercent: number; // 0-100, for pinch abilities
}

export interface CalcMove {
  slug: string;
  type: string;
  power: number;
  damageClass: 'physical' | 'special';
}

export type Weather = 'none' | 'sun' | 'rain' | 'sand' | 'snow';
export type Terrain = 'none' | 'electric' | 'grassy' | 'psychic' | 'misty';

export interface CalcEnvironment {
  weather: Weather;
  terrain: Terrain;
  isCriticalHit: boolean;
  isDoubles: boolean;
  attackerBoost: number; // -6 to +6
  defenderBoost: number; // -6 to +6
  isBurned: boolean;
}

export interface DamageResult {
  minDamage: number;
  maxDamage: number;
  minPercent: number;
  maxPercent: number;
  defenderHP: number;
  rolls: number[];
  effectiveness: number;
  isStab: boolean;
  koChance: string;
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

export function calcStat(
  base: number, ev: number, iv: number, isHP: boolean, natureMod: number, level: number,
): number {
  const evC = Math.floor(ev / 4);
  if (isHP) return Math.floor((2 * base + iv + evC) * level / 100) + level + 10;
  return Math.floor((Math.floor((2 * base + iv + evC) * level / 100) + 5) * natureMod);
}

function getBoostMultiplier(stage: number): number {
  if (stage >= 0) return (2 + stage) / 2;
  return 2 / (2 - stage);
}

function getTypeEffectiveness(moveType: string, defenderTypes: string[]): number {
  return defenderTypes.reduce((mult, defType) => {
    return mult * (TYPE_CHART[moveType as PokemonType]?.[defType as PokemonType] ?? 1);
  }, 1);
}

/* ── Ability modifiers ──────────────────────────────────────────────── */

const ATK_DOUBLING_ABILITIES = new Set([
  'huge-power', 'pure-power',
]);
const ATK_BOOST_ABILITIES = new Set(['hustle']); // 1.5x Atk for physical
const SPA_BOOST_ABILITIES = new Set(['solar-power']); // 1.5x SpA in sun

// Pinch abilities: 1.5x power when HP ≤ 33%
const PINCH_ABILITIES: Record<string, string> = {
  'blaze': 'fire',
  'torrent': 'water',
  'overgrow': 'grass',
  'swarm': 'bug',
};

// Move power modifiers from abilities
function getAbilityMovePowerMod(
  ability: string | null, moveType: string, movePower: number, _damageClass: string,
  currentHPPercent: number,
): number {
  if (!ability) return 1;

  // Pinch abilities (Blaze, Torrent, Overgrow, Swarm)
  const pinchType = PINCH_ABILITIES[ability];
  if (pinchType && pinchType === moveType && currentHPPercent <= 33) return 1.5;

  // Technician: 1.5x for moves with base power ≤ 60
  if (ability === 'technician' && movePower <= 60) return 1.5;

  // Iron Fist: 1.2x for punching moves
  if (ability === 'iron-fist' && PUNCHING_MOVES.has(moveType)) return 1.2;

  // Strong Jaw: 1.5x for biting moves
  if (ability === 'strong-jaw') return 1; // would need move flag data

  // Reckless: 1.2x for recoil moves
  if (ability === 'reckless') return 1; // would need move flag data

  // Sheer Force: 1.3x (removes secondary effects)
  if (ability === 'sheer-force') return 1.3;

  // Tough Claws: 1.3x for contact moves
  if (ability === 'tough-claws') return 1.3;

  // Mega Launcher: 1.5x for aura/pulse moves
  if (ability === 'mega-launcher') return 1; // would need move flag data

  // Aerilate/Pixilate/Refrigerate/Galvanize: 1.2x (type change handled elsewhere)
  if (['aerilate', 'pixilate', 'refrigerate', 'galvanize'].includes(ability) && moveType === 'normal') return 1.2;

  // Analytic: 1.3x if moving last
  if (ability === 'analytic') return 1; // can't determine turn order

  // Tinted Lens: doubles "not very effective" hits (applied at effectiveness stage)
  // Handled separately

  // Sand Force: 1.3x for ground/rock/steel in sand
  if (ability === 'sand-force' && ['ground', 'rock', 'steel'].includes(moveType)) return 1.3;

  // Dark Aura / Fairy Aura: 1.33x for dark/fairy moves
  if (ability === 'dark-aura' && moveType === 'dark') return 4 / 3;
  if (ability === 'fairy-aura' && moveType === 'fairy') return 4 / 3;

  // Steelworker: 1.5x for steel moves
  if (ability === 'steelworker' && moveType === 'steel') return 1.5;

  // Punk Rock: 1.3x for sound moves
  if (ability === 'punk-rock') return 1; // would need move flag data

  return 1;
}

// Placeholder set (Iron Fist punching moves are move-specific, not type-specific)
const PUNCHING_MOVES = new Set<string>();

function getAbilityAtkMod(ability: string | null, damageClass: string, weather: Weather): number {
  if (!ability) return 1;
  if (ATK_DOUBLING_ABILITIES.has(ability)) return damageClass === 'physical' ? 2 : 1;
  if (ATK_BOOST_ABILITIES.has(ability) && damageClass === 'physical') return 1.5;
  if (SPA_BOOST_ABILITIES.has(ability) && damageClass === 'special' && weather === 'sun') return 1.5;
  // Flower Gift: 1.5x Atk in sun
  if (ability === 'flower-gift' && damageClass === 'physical' && weather === 'sun') return 1.5;
  return 1;
}

function getAbilityDefMod(ability: string | null, moveType: string, damageClass: string): number {
  if (!ability) return 1;
  if (ability === 'thick-fat' && (moveType === 'fire' || moveType === 'ice')) return 0.5;
  if (ability === 'ice-scales' && damageClass === 'special') return 0.5;
  // Fur Coat: doubles defense
  if (ability === 'fur-coat' && damageClass === 'physical') return 2;
  // Marvel Scale: 1.5x Def when statused
  if (ability === 'marvel-scale' && damageClass === 'physical') return 1.5;
  // Flower Gift: 1.5x SpD in sun (ally, but we apply to self)
  if (ability === 'flower-gift' && damageClass === 'special') return 1.5;
  return 1;
}

function getAbilityStabMod(ability: string | null): number {
  return ability === 'adaptability' ? 2 : 1.5;
}

// Tinted Lens: "not very effective" becomes neutral
function getAbilityEffectivenessMod(attackerAbility: string | null, effectiveness: number): number {
  if (attackerAbility === 'tinted-lens' && effectiveness < 1 && effectiveness > 0) return 2;
  return 1;
}

function isImmuneDueToAbility(ability: string | null, moveType: string): boolean {
  if (!ability) return false;
  if (ability === 'levitate' && moveType === 'ground') return true;
  if (ability === 'flash-fire' && moveType === 'fire') return true;
  if (ability === 'water-absorb' && moveType === 'water') return true;
  if (ability === 'volt-absorb' && moveType === 'electric') return true;
  if (ability === 'lightning-rod' && moveType === 'electric') return true;
  if (ability === 'storm-drain' && moveType === 'water') return true;
  if (ability === 'sap-sipper' && moveType === 'grass') return true;
  if (ability === 'dry-skin' && moveType === 'water') return true;
  if (ability === 'motor-drive' && moveType === 'electric') return true;
  if (ability === 'earth-eater' && moveType === 'ground') return true;
  if (ability === 'well-baked-body' && moveType === 'fire') return true;
  if (ability === 'wind-rider' && moveType === 'flying') return true;
  return false;
}

/* ── Item modifiers ─────────────────────────────────────────────────── */

const TYPE_BOOSTING_ITEMS: Record<string, string> = {
  charcoal: 'fire', 'mystic-water': 'water', 'miracle-seed': 'grass',
  magnet: 'electric', 'never-melt-ice': 'ice', 'black-belt': 'fighting',
  'poison-barb': 'poison', 'soft-sand': 'ground', 'sharp-beak': 'flying',
  'twisted-spoon': 'psychic', 'silver-powder': 'bug', 'hard-stone': 'rock',
  'spell-tag': 'ghost', 'dragon-fang': 'dragon', 'black-glasses': 'dark',
  'metal-coat': 'steel', 'silk-scarf': 'normal', 'fairy-feather': 'fairy',
  // Plates
  'flame-plate': 'fire', 'splash-plate': 'water', 'meadow-plate': 'grass',
  'zap-plate': 'electric', 'icicle-plate': 'ice', 'fist-plate': 'fighting',
  'toxic-plate': 'poison', 'earth-plate': 'ground', 'sky-plate': 'flying',
  'mind-plate': 'psychic', 'insect-plate': 'bug', 'stone-plate': 'rock',
  'spooky-plate': 'ghost', 'draco-plate': 'dragon', 'dread-plate': 'dark',
  'iron-plate': 'steel', 'pixie-plate': 'fairy',
};

function getItemStatMod(item: string | null, damageClass: string): number {
  if (!item) return 1;
  if (item === 'choice-band' && damageClass === 'physical') return 1.5;
  if (item === 'choice-specs' && damageClass === 'special') return 1.5;
  return 1;
}

function getItemDamageMod(item: string | null, moveType: string, effectiveness: number): number {
  if (!item) return 1;
  if (item === 'life-orb') return 5324 / 4096; // ~1.3
  if (item === 'expert-belt' && effectiveness > 1) return 4915 / 4096; // ~1.2
  const boostedType = TYPE_BOOSTING_ITEMS[item];
  if (boostedType && boostedType === moveType) return 4915 / 4096; // ~1.2
  return 1;
}

function getItemDefMod(item: string | null, damageClass: string): number {
  if (!item) return 1;
  if (item === 'assault-vest' && damageClass === 'special') return 1.5;
  if (item === 'eviolite') return 1.5; // applies to both Def and SpD for NFE
  return 1;
}

/* ── Weather modifiers ──────────────────────────────────────────────── */

function getWeatherMod(weather: Weather, moveType: string): number {
  if (weather === 'sun' && moveType === 'fire') return 1.5;
  if (weather === 'sun' && moveType === 'water') return 0.5;
  if (weather === 'rain' && moveType === 'water') return 1.5;
  if (weather === 'rain' && moveType === 'fire') return 0.5;
  return 1;
}

/* ── Terrain modifiers ──────────────────────────────────────────────── */

function getTerrainMod(terrain: Terrain, moveType: string): number {
  if (terrain === 'electric' && moveType === 'electric') return 1.3;
  if (terrain === 'grassy' && moveType === 'grass') return 1.3;
  if (terrain === 'psychic' && moveType === 'psychic') return 1.3;
  if (terrain === 'misty' && moveType === 'dragon') return 0.5;
  return 1;
}

/* ── KO Chance ──────────────────────────────────────────────────────── */

function computeKOChance(rolls: number[], defenderHP: number): string {
  if (defenderHP <= 0) return '—';
  const koRolls = rolls.filter(r => r >= defenderHP).length;
  if (koRolls === 16) return 'OHKO garantizado';
  if (koRolls > 0) return `${((koRolls / 16) * 100).toFixed(1)}% OHKO`;

  // Check 2HKO: min damage * 2 vs HP
  const minDmg = Math.min(...rolls);
  const maxDmg = Math.max(...rolls);
  if (minDmg * 2 >= defenderHP) return '2HKO garantizado';
  if (maxDmg * 2 >= defenderHP) return '2HKO posible';
  if (minDmg * 3 >= defenderHP) return '3HKO garantizado';
  if (maxDmg * 3 >= defenderHP) return '3HKO posible';
  if (minDmg * 4 >= defenderHP) return '4HKO garantizado';
  if (maxDmg * 4 >= defenderHP) return '4HKO posible';

  return `${Math.ceil(defenderHP / maxDmg)}+ hits`;
}

/* ── Main Calculation ───────────────────────────────────────────────── */

export function calculateDamage(
  attacker: CalcPokemon,
  defender: CalcPokemon,
  move: CalcMove,
  env: CalcEnvironment,
): DamageResult {
  const emptyResult: DamageResult = {
    minDamage: 0, maxDamage: 0, minPercent: 0, maxPercent: 0,
    defenderHP: 0, rolls: Array(16).fill(0), effectiveness: 0,
    isStab: false, koChance: 'Immune',
  };

  // Check immunity via ability
  if (isImmuneDueToAbility(defender.ability, move.type)) {
    const hp = calcStat(defender.baseStats.hp, defender.evs.hp, defender.ivs.hp, true, 1, defender.level);
    return { ...emptyResult, defenderHP: hp, effectiveness: 0 };
  }

  // Type effectiveness — Tera type replaces defensive typing
  const defTypes = defender.teraType && defender.teraType !== 'stellar'
    ? [defender.teraType]
    : defender.types;
  const effectiveness = getTypeEffectiveness(move.type, defTypes);
  if (effectiveness === 0) {
    const hp = calcStat(defender.baseStats.hp, defender.evs.hp, defender.ivs.hp, true, 1, defender.level);
    return { ...emptyResult, defenderHP: hp };
  }

  // STAB — Tera type gives STAB too; if move type matches both original + tera, bonus is 2x (or 2.25x with Adaptability)
  const isOriginalStab = attacker.types.includes(move.type);
  const isTeraStab = attacker.teraType != null && attacker.teraType === move.type;
  const isStab = isOriginalStab || isTeraStab;
  let stabMod = 1;
  if (isTeraStab && isOriginalStab) {
    // Double STAB: original type + tera type match
    stabMod = attacker.ability === 'adaptability' ? 2.25 : 2;
  } else if (isTeraStab) {
    // Tera STAB only (not original type)
    stabMod = attacker.ability === 'adaptability' ? 2 : 1.5;
  } else if (isOriginalStab) {
    stabMod = getAbilityStabMod(attacker.ability);
  }

  // Stats
  const atkNatMods = getNatureModifiers(attacker.nature);
  const defNatMods = getNatureModifiers(defender.nature);

  const isPhysical = move.damageClass === 'physical';
  const atkStatKey: keyof BaseStats = isPhysical ? 'atk' : 'spa';
  const defStatKey: keyof BaseStats = isPhysical ? 'def' : 'spd';

  let atkStat = calcStat(
    attacker.baseStats[atkStatKey], attacker.evs[atkStatKey], attacker.ivs[atkStatKey],
    false, atkNatMods[atkStatKey], attacker.level,
  );
  let defStat = calcStat(
    defender.baseStats[defStatKey], defender.evs[defStatKey], defender.ivs[defStatKey],
    false, defNatMods[defStatKey], defender.level,
  );
  const defHP = calcStat(defender.baseStats.hp, defender.evs.hp, defender.ivs.hp, true, 1, defender.level);

  // Stat boosts
  let atkBoost = env.attackerBoost;
  let defBoost = env.defenderBoost;
  if (env.isCriticalHit) {
    if (atkBoost < 0) atkBoost = 0;
    if (defBoost > 0) defBoost = 0;
  }
  atkStat = Math.floor(atkStat * getBoostMultiplier(atkBoost));
  defStat = Math.floor(defStat * getBoostMultiplier(defBoost));

  // Ability attack modifier
  atkStat = Math.floor(atkStat * getAbilityAtkMod(attacker.ability, move.damageClass, env.weather));

  // Item stat modifier
  atkStat = Math.floor(atkStat * getItemStatMod(attacker.item, move.damageClass));
  defStat = Math.floor(defStat * getItemDefMod(defender.item, move.damageClass));

  // Ability defense modifier
  defStat = Math.floor(defStat * getAbilityDefMod(defender.ability, move.type, move.damageClass));

  // Ensure minimum 1
  if (atkStat < 1) atkStat = 1;
  if (defStat < 1) defStat = 1;

  // Ability-based move power modifier (Blaze, Torrent, Technician, Sheer Force, etc.)
  const abilityPowerMod = getAbilityMovePowerMod(
    attacker.ability, move.type, move.power, move.damageClass,
    attacker.currentHPPercent,
  );
  const effectivePower = Math.floor(move.power * abilityPowerMod);

  // Base damage: ((2 * level / 5 + 2) * power * A / D) / 50 + 2
  const level = attacker.level;
  let baseDamage = Math.floor(
    Math.floor(Math.floor(2 * level / 5 + 2) * effectivePower * atkStat / defStat) / 50 + 2,
  );

  // Doubles spread
  if (env.isDoubles) baseDamage = Math.floor(baseDamage * 0.75);

  // Weather
  const weatherMod = getWeatherMod(env.weather, move.type);
  baseDamage = Math.floor(baseDamage * weatherMod);

  // Critical hit
  if (env.isCriticalHit) baseDamage = Math.floor(baseDamage * 1.5);

  // Generate 16 rolls (random factor 0.85–1.00)
  const rolls: number[] = [];
  for (let r = 85; r <= 100; r++) {
    let dmg = Math.floor(baseDamage * r / 100);

    // STAB
    dmg = Math.floor(dmg * stabMod);

    // Type effectiveness (with Tinted Lens)
    const effMod = effectiveness * getAbilityEffectivenessMod(attacker.ability, effectiveness);
    dmg = Math.floor(dmg * effMod);

    // Burn (physical, non-Guts)
    if (env.isBurned && isPhysical && attacker.ability !== 'guts') {
      dmg = Math.floor(dmg * 0.5);
    }

    // Item damage modifier
    dmg = Math.floor(dmg * getItemDamageMod(attacker.item, move.type, effectiveness));

    // Terrain
    dmg = Math.floor(dmg * getTerrainMod(env.terrain, move.type));

    // Minimum 1 if not immune
    if (dmg < 1) dmg = 1;

    rolls.push(dmg);
  }

  const minDamage = Math.min(...rolls);
  const maxDamage = Math.max(...rolls);

  return {
    minDamage,
    maxDamage,
    minPercent: defHP > 0 ? (minDamage / defHP) * 100 : 0,
    maxPercent: defHP > 0 ? (maxDamage / defHP) * 100 : 0,
    defenderHP: defHP,
    rolls,
    effectiveness,
    isStab,
    koChance: computeKOChance(rolls, defHP),
  };
}

/* ── Default values ─────────────────────────────────────────────────── */

export const DEFAULT_EVS: Record<keyof BaseStats, number> = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
export const DEFAULT_IVS: Record<keyof BaseStats, number> = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

export const DEFAULT_ENVIRONMENT: CalcEnvironment = {
  weather: 'none',
  terrain: 'none',
  isCriticalHit: false,
  isDoubles: false,
  attackerBoost: 0,
  defenderBoost: 0,
  isBurned: false,
};
