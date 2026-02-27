export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

// TYPE_CHART[attackingType][defendingType] = damage multiplier
// Values: 0 (immune), 0.5 (not very effective), 1 (normal), 2 (super effective)
export const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal:   { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:1, rock:0.5, ghost:0, dragon:1, dark:1, steel:0.5, fairy:1 },
  fire:     { normal:1, fire:0.5, water:0.5, electric:1, grass:2, ice:2, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:2, rock:0.5, ghost:1, dragon:0.5, dark:1, steel:2, fairy:1 },
  water:    { normal:1, fire:2, water:0.5, electric:1, grass:0.5, ice:1, fighting:1, poison:1, ground:2, flying:1, psychic:1, bug:1, rock:2, ghost:1, dragon:0.5, dark:1, steel:1, fairy:1 },
  electric: { normal:1, fire:1, water:2, electric:0.5, grass:0.5, ice:1, fighting:1, poison:1, ground:0, flying:2, psychic:1, bug:1, rock:1, ghost:1, dragon:0.5, dark:1, steel:1, fairy:1 },
  grass:    { normal:1, fire:0.5, water:2, electric:1, grass:0.5, ice:1, fighting:1, poison:0.5, ground:2, flying:0.5, psychic:1, bug:0.5, rock:2, ghost:1, dragon:0.5, dark:1, steel:0.5, fairy:1 },
  ice:      { normal:1, fire:0.5, water:0.5, electric:1, grass:2, ice:0.5, fighting:1, poison:1, ground:2, flying:2, psychic:1, bug:1, rock:1, ghost:1, dragon:2, dark:1, steel:0.5, fairy:1 },
  fighting: { normal:2, fire:1, water:1, electric:1, grass:1, ice:2, fighting:1, poison:0.5, ground:1, flying:0.5, psychic:0.5, bug:0.5, rock:2, ghost:0, dragon:1, dark:2, steel:2, fairy:0.5 },
  poison:   { normal:1, fire:1, water:1, electric:1, grass:2, ice:1, fighting:1, poison:0.5, ground:0.5, flying:1, psychic:1, bug:1, rock:0.5, ghost:0.5, dragon:1, dark:1, steel:0, fairy:2 },
  ground:   { normal:1, fire:2, water:1, electric:2, grass:0.5, ice:1, fighting:1, poison:2, ground:1, flying:0, psychic:1, bug:0.5, rock:2, ghost:1, dragon:1, dark:1, steel:2, fairy:1 },
  flying:   { normal:1, fire:1, water:1, electric:0.5, grass:2, ice:1, fighting:2, poison:1, ground:1, flying:1, psychic:1, bug:2, rock:0.5, ghost:1, dragon:1, dark:1, steel:0.5, fairy:1 },
  psychic:  { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:2, poison:2, ground:1, flying:1, psychic:0.5, bug:1, rock:1, ghost:1, dragon:1, dark:0, steel:0.5, fairy:1 },
  bug:      { normal:1, fire:0.5, water:1, electric:1, grass:2, ice:1, fighting:0.5, poison:0.5, ground:1, flying:0.5, psychic:2, bug:1, rock:1, ghost:0.5, dragon:1, dark:2, steel:0.5, fairy:0.5 },
  rock:     { normal:1, fire:2, water:1, electric:1, grass:1, ice:2, fighting:0.5, poison:1, ground:0.5, flying:2, psychic:1, bug:2, rock:1, ghost:1, dragon:1, dark:1, steel:0.5, fairy:1 },
  ghost:    { normal:0, fire:1, water:1, electric:1, grass:1, ice:1, fighting:1, poison:1, ground:1, flying:1, psychic:2, bug:1, rock:1, ghost:2, dragon:1, dark:0.5, steel:1, fairy:1 },
  dragon:   { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:1, rock:1, ghost:1, dragon:2, dark:1, steel:0.5, fairy:0 },
  dark:     { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:0.5, poison:1, ground:1, flying:1, psychic:2, bug:1, rock:1, ghost:2, dragon:1, dark:0.5, steel:0.5, fairy:0.5 },
  steel:    { normal:1, fire:0.5, water:0.5, electric:0.5, grass:1, ice:2, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:1, rock:2, ghost:1, dragon:1, dark:1, steel:0.5, fairy:2 },
  fairy:    { normal:1, fire:0.5, water:1, electric:1, grass:1, ice:1, fighting:2, poison:0.5, ground:1, flying:1, psychic:1, bug:1, rock:1, ghost:1, dragon:2, dark:2, steel:0.5, fairy:1 },
};

// Compute multiplier for incoming attack type vs a Pokémon with the given types
export function computeDefensiveMultiplier(attackType: PokemonType, defenderTypes: string[]): number {
  return defenderTypes.reduce((mult, defType) => {
    return mult * (TYPE_CHART[attackType]?.[defType as PokemonType] ?? 1);
  }, 1);
}

export interface TeamDefensiveProfile {
  weaknesses:  Record<PokemonType, number>; // count of members weak to this type (>1x)
  immunities:  Record<PokemonType, number>; // count of members immune (0x)
  resistances: Record<PokemonType, number>; // count of members resisting (>0x and <1x)
}

// For a full team, count how many members have each relationship with each attack type
export function computeTeamDefensive(memberTypes: string[][]): TeamDefensiveProfile {
  const weaknesses  = Object.fromEntries(ALL_TYPES.map(t => [t, 0])) as Record<PokemonType, number>;
  const immunities  = Object.fromEntries(ALL_TYPES.map(t => [t, 0])) as Record<PokemonType, number>;
  const resistances = Object.fromEntries(ALL_TYPES.map(t => [t, 0])) as Record<PokemonType, number>;

  for (const types of memberTypes) {
    for (const atkType of ALL_TYPES) {
      const mult = computeDefensiveMultiplier(atkType, types);
      if (mult > 1)       weaknesses[atkType]++;
      else if (mult === 0) immunities[atkType]++;
      else if (mult < 1)  resistances[atkType]++;
    }
  }

  return { weaknesses, immunities, resistances };
}

// Which defending types can the team hit super-effectively using STAB moves?
export function computeTeamOffensive(memberTypes: string[][]): Record<PokemonType, boolean> {
  const coverage = Object.fromEntries(ALL_TYPES.map(t => [t, false])) as Record<PokemonType, boolean>;

  for (const types of memberTypes) {
    for (const stabType of types) {
      const row = TYPE_CHART[stabType as PokemonType];
      if (!row) continue;
      for (const defType of ALL_TYPES) {
        if ((row[defType] ?? 1) >= 2) coverage[defType] = true;
      }
    }
  }

  return coverage;
}
