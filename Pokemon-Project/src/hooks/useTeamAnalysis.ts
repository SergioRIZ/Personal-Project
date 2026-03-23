import { useMemo } from 'react';
import type { PokemonType } from '../lib/typeChart';
import {
  ALL_TYPES,
  computeTeamDefensiveWithAbilities,
  computeTeamOffensive,
  computeMoveCoverage,
  type TeamDefensiveProfile,
} from '../lib/typeChart';
import { abilityAdjustedMultiplier } from '../lib/abilityDefense';
import { calcAllStats } from '../lib/statCalc';
import type { BaseStats } from './usePokemonBaseStats';
import type { MoveDetail } from './useMoveDetails';
import type { Team, TeamMember } from '../lib/teams';

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export interface MatchupCell {
  /** Types where team-A member hits team-B member super-effectively */
  atkSE: PokemonType[];
  /** Types where team-B member hits team-A member super-effectively */
  defSE: PokemonType[];
}

export interface SynergyPair {
  coverer: TeamMember;
  covered: TeamMember;
  type: PokemonType;
}

export type MemberRole =
  | 'phys_attacker'
  | 'spec_attacker'
  | 'phys_wall'
  | 'spec_wall'
  | 'speedster'
  | 'balanced';

export interface AggStats {
  physBulk: number;
  specBulk: number;
  atk: number;
  spa: number;
  spe: number;
}

export interface OffensiveCoverageEntry {
  stab: PokemonType[];
  move: PokemonType[];
  uncovered: PokemonType[];
  hasMoves: boolean;
}

export interface TeamAnalysis {
  matchupMatrix: MatchupCell[][];
  synergies: { teamA: SynergyPair[]; teamB: SynergyPair[] };
  threats: { teamA: PokemonType[]; teamB: PokemonType[] };
  roles: Map<string, MemberRole>;
  aggregateStats: { teamA: AggStats | null; teamB: AggStats | null };
  defensiveProfiles: { teamA: TeamDefensiveProfile | null; teamB: TeamDefensiveProfile | null };
  offensiveCoverage: { teamA: OffensiveCoverageEntry | null; teamB: OffensiveCoverageEntry | null };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the attacking types for a member: use move types if available, else STAB from pokemon_types */
function getAttackTypes(member: TeamMember, moveMap: Record<string, MoveDetail>): PokemonType[] {
  const moveTypes: PokemonType[] = [];
  for (const slug of member.moves) {
    if (slug && moveMap[slug]) {
      const md = moveMap[slug];
      if (md.damageClass !== 'status' && md.type) {
        moveTypes.push(md.type as PokemonType);
      }
    }
  }
  if (moveTypes.length > 0) return [...new Set(moveTypes)];
  // Fallback to STAB types
  return member.pokemon_types.filter((t): t is PokemonType =>
    ALL_TYPES.includes(t as PokemonType),
  );
}

/** Check if atkType is super-effective against defender considering ability */
function isSE(
  atkType: PokemonType,
  defenderTypes: string[],
  defenderAbility: string | null,
): boolean {
  const mult = abilityAdjustedMultiplier(atkType, defenderTypes, defenderAbility);
  return mult > 1;
}

/** Compute synergy pairs for a team */
function computeSynergies(
  members: TeamMember[],
): SynergyPair[] {
  const pairs: SynergyPair[] = [];

  for (const covered of members) {
    // Find types this member is weak to
    for (const atkType of ALL_TYPES) {
      const mult = abilityAdjustedMultiplier(atkType, covered.pokemon_types, covered.ability);
      if (mult <= 1) continue; // not weak

      // Find another member that resists or is immune to this type
      for (const coverer of members) {
        if (coverer.id === covered.id) continue;
        const coverMult = abilityAdjustedMultiplier(atkType, coverer.pokemon_types, coverer.ability);
        if (coverMult < 1) {
          pairs.push({ coverer, covered, type: atkType });
        }
      }
    }
  }

  return pairs;
}

/** Find types that are unresisted team-wide threats (weakness count >= 3, resistance+immunity === 0) */
function computeThreats(members: TeamMember[]): PokemonType[] {
  if (members.length === 0) return [];

  const profile = computeTeamDefensiveWithAbilities(
    members.map(m => ({ types: m.pokemon_types, ability: m.ability })),
    abilityAdjustedMultiplier,
  );

  return ALL_TYPES.filter(
    t => profile.weaknesses[t] >= 3 && profile.resistances[t] + profile.immunities[t] === 0,
  );
}

/** Classify a member's role based on calculated stats */
function classifyRole(stats: BaseStats): MemberRole {
  // Compare ratios: which stat stands out the most
  const total = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
  if (total === 0) return 'balanced';

  const ratios: { role: MemberRole; value: number }[] = [
    { role: 'phys_attacker', value: stats.atk },
    { role: 'spec_attacker', value: stats.spa },
    { role: 'phys_wall', value: (stats.hp + stats.def) / 2 },
    { role: 'spec_wall', value: (stats.hp + stats.spd) / 2 },
    { role: 'speedster', value: stats.spe },
  ];

  ratios.sort((a, b) => b.value - a.value);

  // If the top stat doesn't stand out enough, call it balanced
  const top = ratios[0];
  const second = ratios[1];
  if (top.value < second.value * 1.15) return 'balanced';

  return top.role;
}

/** Compute aggregate stats for a team */
function computeAggregateStats(
  members: TeamMember[],
  statsMap: Record<number, BaseStats>,
): AggStats | null {
  if (members.length === 0) return null;

  let totalPhysBulk = 0;
  let totalSpecBulk = 0;
  let totalAtk = 0;
  let totalSpa = 0;
  let totalSpe = 0;
  let count = 0;

  for (const m of members) {
    const base = statsMap[m.pokemon_id];
    if (!base) continue;
    const calc = calcAllStats(base, m.nature, m.evs, m.ivs);
    totalPhysBulk += (calc.hp * calc.def) / 100;
    totalSpecBulk += (calc.hp * calc.spd) / 100;
    totalAtk += calc.atk;
    totalSpa += calc.spa;
    totalSpe += calc.spe;
    count++;
  }

  if (count === 0) return null;

  return {
    physBulk: Math.round(totalPhysBulk / count),
    specBulk: Math.round(totalSpecBulk / count),
    atk: Math.round(totalAtk / count),
    spa: Math.round(totalSpa / count),
    spe: Math.round(totalSpe / count),
  };
}

/** Compute offensive coverage entry for a team */
function computeOffensiveCoverageEntry(
  members: TeamMember[],
  moveMap: Record<string, MoveDetail>,
): OffensiveCoverageEntry {
  const memberTypes = members.map(m => m.pokemon_types);
  const stabCoverage = computeTeamOffensive(memberTypes);
  const stabTypes = ALL_TYPES.filter(t => stabCoverage[t]);

  // Collect all damage-dealing move types across the team
  const allMoveTypes: PokemonType[] = [];
  let hasMoves = false;
  for (const m of members) {
    for (const slug of m.moves) {
      if (slug && moveMap[slug]) {
        const md = moveMap[slug];
        if (md.damageClass !== 'status' && md.type) {
          hasMoves = true;
          allMoveTypes.push(md.type as PokemonType);
        }
      }
    }
  }

  const moveCoverage = computeMoveCoverage([...new Set(allMoveTypes)]);
  const moveTypes = ALL_TYPES.filter(t => moveCoverage[t]);

  // Uncovered = types that neither STAB nor moves hit SE
  const coveredSet = new Set<PokemonType>([...stabTypes, ...moveTypes]);
  const uncovered = ALL_TYPES.filter(t => !coveredSet.has(t));

  return { stab: stabTypes, move: moveTypes, uncovered, hasMoves };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTeamAnalysis(
  teamA: Team | null,
  teamB: Team | null,
  moveMap: Record<string, MoveDetail>,
  statsMap: Record<number, BaseStats>,
): TeamAnalysis {
  const membersA = teamA?.members ?? [];
  const membersB = teamB?.members ?? [];

  // Stable serialization keys for memo deps
  const keyA = useMemo(
    () => membersA.map(m => m.id).join(','),
    [membersA],
  );
  const keyB = useMemo(
    () => membersB.map(m => m.id).join(','),
    [membersB],
  );
  const moveMapKey = useMemo(
    () => Object.keys(moveMap).sort().join(','),
    [moveMap],
  );
  const statsMapKey = useMemo(
    () => Object.keys(statsMap).sort().join(','),
    [statsMap],
  );

  // 1. Matchup matrix
  const matchupMatrix = useMemo<MatchupCell[][]>(() => {
    if (membersA.length === 0 || membersB.length === 0) return [];

    return membersA.map(a => {
      const atkTypesA = getAttackTypes(a, moveMap);
      return membersB.map(b => {
        const atkTypesB = getAttackTypes(b, moveMap);

        const atkSE = atkTypesA.filter(t => isSE(t, b.pokemon_types, b.ability));
        const defSE = atkTypesB.filter(t => isSE(t, a.pokemon_types, a.ability));

        return { atkSE, defSE };
      });
    });
  }, [keyA, keyB, moveMapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Synergies
  const synergies = useMemo(() => ({
    teamA: computeSynergies(membersA),
    teamB: computeSynergies(membersB),
  }), [keyA, keyB]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Threats
  const threats = useMemo(() => ({
    teamA: computeThreats(membersA),
    teamB: computeThreats(membersB),
  }), [keyA, keyB]); // eslint-disable-line react-hooks/exhaustive-deps

  // 4. Roles
  const roles = useMemo(() => {
    const map = new Map<string, MemberRole>();
    const allMembers = [...membersA, ...membersB];
    for (const m of allMembers) {
      if (map.has(m.id)) continue;
      const base = statsMap[m.pokemon_id];
      if (!base) {
        map.set(m.id, 'balanced');
        continue;
      }
      const calc = calcAllStats(base, m.nature, m.evs, m.ivs);
      map.set(m.id, classifyRole(calc));
    }
    return map;
  }, [keyA, keyB, statsMapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // 5. Aggregate stats
  const aggregateStats = useMemo(() => ({
    teamA: computeAggregateStats(membersA, statsMap),
    teamB: computeAggregateStats(membersB, statsMap),
  }), [keyA, keyB, statsMapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // 6. Defensive profiles
  const defensiveProfiles = useMemo(() => ({
    teamA: membersA.length > 0
      ? computeTeamDefensiveWithAbilities(
          membersA.map(m => ({ types: m.pokemon_types, ability: m.ability })),
          abilityAdjustedMultiplier,
        )
      : null,
    teamB: membersB.length > 0
      ? computeTeamDefensiveWithAbilities(
          membersB.map(m => ({ types: m.pokemon_types, ability: m.ability })),
          abilityAdjustedMultiplier,
        )
      : null,
  }), [keyA, keyB]); // eslint-disable-line react-hooks/exhaustive-deps

  // 7. Offensive coverage
  const offensiveCoverage = useMemo(() => ({
    teamA: membersA.length > 0 ? computeOffensiveCoverageEntry(membersA, moveMap) : null,
    teamB: membersB.length > 0 ? computeOffensiveCoverageEntry(membersB, moveMap) : null,
  }), [keyA, keyB, moveMapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    matchupMatrix,
    synergies,
    threats,
    roles,
    aggregateStats,
    defensiveProfiles,
    offensiveCoverage,
  };
}
