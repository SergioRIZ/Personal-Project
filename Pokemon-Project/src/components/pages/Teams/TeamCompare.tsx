import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTeams } from '../../../context/TeamsContext';
import { navigate } from '../../../navigation';
import { ALL_TYPES } from '../../../lib/typeChart';
import { abilityAdjustedMultiplier } from '../../../lib/abilityDefense';
import { translateType, getTypeSpriteUrl } from '../Pokedex/utils';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import type { MoveDetail } from '../../../hooks/useMoveDetails';
import { useTeamBaseStats } from '../../../hooks/useTeamBaseStats';
import { calcAllStats } from '../../../lib/statCalc';
import type { BaseStats } from '../../../hooks/usePokemonBaseStats';
import type { Team, TeamMember } from '../../../lib/teams';
import type { PokemonType } from '../../../lib/typeChart';
import { useSpriteResolver } from '../../../hooks/usePokemonSearch';
import { useTeamAnalysis } from '../../../hooks/useTeamAnalysis';
import type { MemberRole } from '../../../hooks/useTeamAnalysis';

const A_COLOR = '#3B82F6';
const B_COLOR = '#EF4444';

type TabId = 'overview' | 'defense' | 'matchups' | 'stats' | 'synergies';

/* ─── Sprite helper ──────────────────────────────────────────── */
const spriteUrl = (name: string, id: number, resolve: (n: string, i: number) => number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${resolve(name, id)}.png`;

const fmtName = (n: string) => n.replace(/-/g, ' ');

/* ─── TypeBadgeList ──────────────────────────────────────────── */
const TypeBadgeList: React.FC<{
  types: PokemonType[];
  counts?: Record<PokemonType, number>;
  lang: string;
  compact?: boolean;
}> = ({ types, counts, lang, compact }) => {
  if (types.length === 0) return <p className="text-base text-[var(--text-muted)] italic">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {types.map(type => (
        <span key={type} className="inline-flex items-center gap-1">
          <img
            src={getTypeSpriteUrl(type)}
            alt={translateType(type, lang)}
            title={translateType(type, lang)}
            className={`${compact ? 'w-20' : 'w-24'} h-auto object-contain drop-shadow-md hover:scale-110 transition-transform duration-200`}
          />
          {counts && counts[type] > 1 && (
            <span className="text-sm font-black text-[var(--text-muted)]">&times;{counts[type]}</span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ─── MemberAvatar ───────────────────────────────────────────── */
const MemberAvatar: React.FC<{
  member: TeamMember;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  resolveSprite: (n: string, i: number) => number;
}> = ({ member, color, size = 'md', resolveSprite }) => {
  const sizes = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-18 h-18' };
  const imgSizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-[var(--color-card-alt)] flex items-center justify-center shrink-0 overflow-hidden border-2 transition-transform hover:scale-110`}
      style={{ borderColor: color }}
      title={fmtName(member.pokemon_name)}
    >
      <img
        src={spriteUrl(member.pokemon_name, member.pokemon_id, resolveSprite)}
        alt={member.pokemon_name}
        className={`${imgSizes[size]} object-contain`}
        loading="lazy"
      />
    </div>
  );
};



/* ─── Section Card wrapper ───────────────────────────────────── */
const SectionCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  color?: string;
  className?: string;
}> = ({ children, title, color, className = '' }) => (
  <div className={`rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg overflow-hidden ${className}`}>
    {title && (
      <div className="px-4 pt-4 pb-2">
        <p className="text-base font-black uppercase tracking-wider" style={{ color: color || 'var(--text-primary)' }}>
          {title}
        </p>
      </div>
    )}
    <div className="px-4 pb-4">{children}</div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   TAB: Overview — Strategic Battle Analysis
   ═══════════════════════════════════════════════════════════════ */
const OverviewTab: React.FC<{
  teamA: Team;
  teamB: Team;
  analysis: ReturnType<typeof useTeamAnalysis>;
  statsMap: Record<number, BaseStats>;
  resolveSprite: (n: string, i: number) => number;
  lang: string;
}> = ({ teamA, teamB, analysis, statsMap, resolveSprite, lang }) => {
  const { t } = useTranslation();
  const { aggregateStats, matchupMatrix, offensiveCoverage, defensiveProfiles, threats } = analysis;

  // ── Compute all metrics ──────────────────────────────────────
  const scoreA = useMemo(() =>
    matchupMatrix.reduce((sum, row) => sum + row.reduce((s, cell) => s + cell.atkSE.length, 0), 0),
    [matchupMatrix],
  );
  const scoreB = useMemo(() =>
    matchupMatrix.reduce((sum, row) => sum + row.reduce((s, cell) => s + cell.defSE.length, 0), 0),
    [matchupMatrix],
  );

  const covA = offensiveCoverage.teamA;
  const covB = offensiveCoverage.teamB;
  const defA = defensiveProfiles.teamA;
  const defB = defensiveProfiles.teamB;
  const aggA = aggregateStats.teamA;
  const aggB = aggregateStats.teamB;

  const coverageCountA = covA ? (covA.hasMoves ? covA.move.length : covA.stab.length) : 0;
  const coverageCountB = covB ? (covB.hasMoves ? covB.move.length : covB.stab.length) : 0;
  const weakCountA = defA ? ALL_TYPES.filter(tp => defA.weaknesses[tp] > 0).length : 0;
  const weakCountB = defB ? ALL_TYPES.filter(tp => defB.weaknesses[tp] > 0).length : 0;
  const spdA = aggA?.spe ?? 0;
  const spdB = aggB?.spe ?? 0;

  // ── Weighted verdict ─────────────────────────────────────────
  const verdictScore = useMemo(() => {
    let score = 0;
    if (scoreA !== scoreB) score += (scoreA > scoreB ? 3 : -3);
    if (weakCountA !== weakCountB) score += (weakCountA < weakCountB ? 2 : -2);
    if (spdA !== spdB) score += (spdA > spdB ? 1.5 : -1.5);
    if (coverageCountA !== coverageCountB) score += (coverageCountA > coverageCountB ? 1 : -1);
    return score;
  }, [scoreA, scoreB, weakCountA, weakCountB, spdA, spdB, coverageCountA, coverageCountB]);

  const winner: 'a' | 'b' | 'tie' = verdictScore > 1 ? 'a' : verdictScore < -1 ? 'b' : 'tie';
  const winnerColor = winner === 'a' ? A_COLOR : winner === 'b' ? B_COLOR : 'var(--text-primary)';
  const winnerName = winner === 'a' ? teamA.name : winner === 'b' ? teamB.name : '';

  // ── Key factors ──────────────────────────────────────────────
  const factors = useMemo(() => {
    const list: { text: string; icon: 'offense' | 'defense' | 'speed' | 'coverage' | 'bulk' }[] = [];
    if (scoreA !== scoreB) {
      const diff = Math.abs(scoreA - scoreB);
      const better = scoreA > scoreB ? teamA.name : teamB.name;
      list.push({ text: t('compare_factor_se', { team: better, count: diff }), icon: 'offense' });
    }
    if (weakCountA !== weakCountB) {
      const better = weakCountA < weakCountB ? teamA.name : teamB.name;
      list.push({ text: t('compare_factor_defense', { team: better, a: Math.min(weakCountA, weakCountB), b: Math.max(weakCountA, weakCountB) }), icon: 'defense' });
    }
    if (spdA !== spdB) {
      const better = spdA > spdB ? teamA.name : teamB.name;
      list.push({ text: t('compare_factor_speed', { team: better, a: Math.max(spdA, spdB), b: Math.min(spdA, spdB) }), icon: 'speed' });
    }
    if (coverageCountA !== coverageCountB) {
      const better = coverageCountA > coverageCountB ? teamA.name : teamB.name;
      list.push({ text: t('compare_factor_coverage', { team: better, a: Math.max(coverageCountA, coverageCountB), b: Math.min(coverageCountA, coverageCountB) }), icon: 'coverage' });
    }
    if (aggA && aggB && aggA.physBulk !== aggB.physBulk) {
      const diff = Math.abs(aggA.physBulk - aggB.physBulk);
      if (diff > 20) {
        const better = aggA.physBulk > aggB.physBulk ? teamA.name : teamB.name;
        list.push({ text: t('compare_factor_bulk_phys', { team: better, a: Math.max(aggA.physBulk, aggB.physBulk), b: Math.min(aggA.physBulk, aggB.physBulk) }), icon: 'bulk' });
      }
    }
    if (aggA && aggB && aggA.specBulk !== aggB.specBulk) {
      const diff = Math.abs(aggA.specBulk - aggB.specBulk);
      if (diff > 20) {
        const better = aggA.specBulk > aggB.specBulk ? teamA.name : teamB.name;
        list.push({ text: t('compare_factor_bulk_spec', { team: better, a: Math.max(aggA.specBulk, aggB.specBulk), b: Math.min(aggA.specBulk, aggB.specBulk) }), icon: 'bulk' });
      }
    }
    return list;
  }, [scoreA, scoreB, weakCountA, weakCountB, spdA, spdB, coverageCountA, coverageCountB, aggA, aggB, teamA.name, teamB.name, t]);

  // ── Per-team strategy data ───────────────────────────────────
  const computeStrategy = (team: Team, opponent: Team, isTeamA: boolean) => {
    const members = team.members;
    const oppMembers = opponent.members;

    // Fastest member
    let fastest: { member: TeamMember; speed: number } | null = null;
    for (const m of members) {
      const base = statsMap[m.pokemon_id];
      if (!base) continue;
      const speed = calcAllStats(base, m.nature, m.evs, m.ivs).spe;
      if (!fastest || speed > fastest.speed) fastest = { member: m, speed };
    }

    // MVP: member with most SE hits against opponent
    let mvp: { member: TeamMember; count: number } | null = null;
    for (let i = 0; i < members.length; i++) {
      const sorted = [...members].sort((a, b) => a.slot - b.slot);
      const memberIdx = sorted.findIndex(m => m.id === members[i].id);
      let seCount = 0;
      if (isTeamA) {
        for (let j = 0; j < oppMembers.length; j++) {
          seCount += (matchupMatrix[memberIdx]?.[j]?.atkSE.length ?? 0);
        }
      } else {
        const sortedOpp = [...oppMembers].sort((a, b) => a.slot - b.slot);
        for (let j = 0; j < sortedOpp.length; j++) {
          seCount += (matchupMatrix[j]?.[memberIdx]?.defSE.length ?? 0);
        }
      }
      if (!mvp || seCount > mvp.count) mvp = { member: members[i], count: seCount };
    }

    // Biggest threat from opponent
    let biggestThreat: { member: TeamMember; count: number } | null = null;
    for (let j = 0; j < oppMembers.length; j++) {
      let threatCount = 0;
      if (isTeamA) {
        for (let i = 0; i < members.length; i++) {
          if ((matchupMatrix[i]?.[j]?.defSE.length ?? 0) > 0) threatCount++;
        }
      } else {
        for (let i = 0; i < members.length; i++) {
          if ((matchupMatrix[j]?.[i]?.atkSE.length ?? 0) > 0) threatCount++;
        }
      }
      if (!biggestThreat || threatCount > biggestThreat.count) biggestThreat = { member: oppMembers[j], count: threatCount };
    }

    const myThreats = isTeamA ? threats.teamA : threats.teamB;
    const oppThreats = isTeamA ? threats.teamB : threats.teamA;
    const mySpe = isTeamA ? spdA : spdB;
    const oppSpe = isTeamA ? spdB : spdA;
    const myBulk = isTeamA ? aggA : aggB;
    const oppBulk = isTeamA ? aggB : aggA;

    return { fastest, mvp, biggestThreat, myThreats, oppThreats, mySpe, oppSpe, myBulk, oppBulk };
  };

  const stratA = useMemo(() => computeStrategy(teamA, teamB, true), [teamA, teamB, matchupMatrix, statsMap, threats, spdA, spdB, aggA, aggB]);
  const stratB = useMemo(() => computeStrategy(teamB, teamA, false), [teamA, teamB, matchupMatrix, statsMap, threats, spdA, spdB, aggA, aggB]);

  const FACTOR_ICONS: Record<string, React.ReactNode> = {
    offense: <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" /></svg>,
    defense: <svg className="w-5 h-5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" /></svg>,
    speed: <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>,
    coverage: <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>,
    bulk: <svg className="w-5 h-5 text-cyan-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>,
  };

  const renderStrategy = (
    team: Team,
    strat: ReturnType<typeof computeStrategy>,
    color: string,
    oppColor: string,
  ) => (
    <SectionCard>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-base font-black uppercase tracking-wider" style={{ color }}>
          {t('compare_how_to_play')} — {team.name}
        </p>
      </div>
      <div className="space-y-3">
        {/* Lead */}
        {strat.fastest && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
            <MemberAvatar member={strat.fastest.member} color={color} resolveSprite={resolveSprite} />
            <p className="text-sm text-[var(--text-primary)]">
              {t('compare_lead_with', { pokemon: fmtName(strat.fastest.member.pokemon_name), speed: strat.fastest.speed })}
            </p>
          </div>
        )}

        {/* MVP */}
        {strat.mvp && strat.mvp.count > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
            <MemberAvatar member={strat.mvp.member} color={color} resolveSprite={resolveSprite} />
            <p className="text-sm text-[var(--text-primary)]">
              {t('compare_mvp', { pokemon: fmtName(strat.mvp.member.pokemon_name), count: strat.mvp.count })}
            </p>
          </div>
        )}

        {/* Biggest threat */}
        {strat.biggestThreat && strat.biggestThreat.count > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <MemberAvatar member={strat.biggestThreat.member} color={oppColor} resolveSprite={resolveSprite} />
            <p className="text-sm text-[var(--text-primary)]">
              {t('compare_watch_out', { pokemon: fmtName(strat.biggestThreat.member.pokemon_name), count: strat.biggestThreat.count })}
            </p>
          </div>
        )}

        {/* Exploit opponent shared weakness */}
        {strat.oppThreats.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-sm text-[var(--text-primary)] mb-2">{t('compare_exploit_shared')}</p>
            <TypeBadgeList types={strat.oppThreats} lang={lang} compact />
          </div>
        )}

        {/* Protect own shared weakness */}
        {strat.myThreats.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm text-[var(--text-primary)] mb-2">{t('compare_protect_shared')}</p>
            <TypeBadgeList types={strat.myThreats} lang={lang} compact />
          </div>
        )}

        {/* Tactical advice */}
        <div className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
          <p className="text-sm text-[var(--text-secondary)] italic">
            {strat.mySpe > strat.oppSpe
              ? t('compare_speed_control')
              : strat.mySpe < strat.oppSpe
                ? t('compare_speed_behind')
                : strat.myBulk && strat.oppBulk && (strat.myBulk.physBulk + strat.myBulk.specBulk) > (strat.oppBulk.physBulk + strat.oppBulk.specBulk)
                  ? t('compare_bulk_play')
                  : t('compare_offensive_play')
            }
          </p>
        </div>
      </div>
    </SectionCard>
  );

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Verdict banner */}
      <div className="relative rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          background: winner === 'tie'
            ? `linear-gradient(135deg, ${A_COLOR} 0%, transparent 50%, ${B_COLOR} 100%)`
            : `linear-gradient(135deg, ${winnerColor}40 0%, transparent 100%)`,
        }} />
        <div className="relative p-5 sm:p-8 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)] mb-3">
            {t('compare_analysis_title')}
          </p>
          <p className="text-xl sm:text-2xl font-black mb-2" style={{ color: winnerColor, fontFamily: 'var(--font-display)' }}>
            {winner === 'tie'
              ? t('compare_even_match')
              : t('compare_overall_advantage', { team: winnerName })
            }
          </p>
        </div>
      </div>

      {/* Key factors */}
      <SectionCard title={t('compare_key_factors')}>
        {factors.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] italic">{t('compare_no_factors')}</p>
        ) : (
          <div className="space-y-2.5">
            {factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
                {FACTOR_ICONS[factor.icon]}
                <p className="text-sm text-[var(--text-primary)]">{factor.text}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* How to play each team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderStrategy(teamA, stratA, A_COLOR, B_COLOR)}
        {renderStrategy(teamB, stratB, B_COLOR, A_COLOR)}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TAB: Defense
   ═══════════════════════════════════════════════════════════════ */
const DefenseTab: React.FC<{
  teamA: Team;
  teamB: Team;
  analysis: ReturnType<typeof useTeamAnalysis>;
  lang: string;
}> = ({ teamA, teamB, analysis, lang }) => {
  const { t } = useTranslation();
  const { defensiveProfiles, offensiveCoverage, threats } = analysis;

  const renderTeamDefense = (team: Team, profile: NonNullable<typeof defensiveProfiles.teamA>, coverage: NonNullable<typeof offensiveCoverage.teamA>, teamThreats: PokemonType[], color: string) => {
    const weakTypes = ALL_TYPES.filter(tp => profile.weaknesses[tp] > 0);
    const resistTypes = ALL_TYPES.filter(tp => profile.resistances[tp] > 0);
    const immuneTypes = ALL_TYPES.filter(tp => profile.immunities[tp] > 0);
    const coveredTypes = coverage.hasMoves ? coverage.move : coverage.stab;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-sm font-black uppercase tracking-wider" style={{ color }}>{team.name}</p>
        </div>

        {/* Shared weaknesses alert */}
        {teamThreats.length > 0 && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm font-black uppercase tracking-wider text-red-500 mb-1.5">
              {t('compare_shared_weaknesses')}
            </p>
            <p className="text-sm text-red-400/80 mb-1.5">{t('compare_shared_weaknesses_desc')}</p>
            <TypeBadgeList types={teamThreats} lang={lang} compact />
          </div>
        )}

        {/* Weaknesses */}
        <div className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/50">
          <p className="text-sm font-bold text-red-500 mb-1.5">{t('compare_weaknesses')} ({weakTypes.length})</p>
          <TypeBadgeList types={weakTypes} counts={profile.weaknesses} lang={lang} compact />
        </div>

        {/* Resistances */}
        {resistTypes.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/50">
            <p className="text-sm font-bold text-emerald-500 mb-1.5">{t('compare_resistances')} ({resistTypes.length})</p>
            <TypeBadgeList types={resistTypes} counts={profile.resistances} lang={lang} compact />
          </div>
        )}

        {/* Immunities */}
        {immuneTypes.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/50">
            <p className="text-sm font-bold text-blue-500 mb-1.5">{t('compare_immunities')} ({immuneTypes.length})</p>
            <TypeBadgeList types={immuneTypes} counts={profile.immunities} lang={lang} compact />
          </div>
        )}

        {/* Coverage */}
        <div className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/50">
          <p className="text-sm font-bold mb-1.5" style={{ color }}>
            {coverage.hasMoves ? t('compare_move_coverage') : t('compare_stab_coverage')}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-3.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(coveredTypes.length / ALL_TYPES.length) * 100}%`, backgroundColor: color }} />
            </div>
            <span className="text-base font-black tabular-nums">{coveredTypes.length}/{ALL_TYPES.length}</span>
          </div>
          <TypeBadgeList types={coveredTypes} lang={lang} compact />
          {coverage.uncovered.length > 0 && coverage.hasMoves && (
            <div className="mt-2 pt-2 border-t border-[var(--color-border)]/30">
              <p className="text-sm font-bold text-[var(--text-muted)] mb-1">{t('compare_uncovered')} ({coverage.uncovered.length})</p>
              <TypeBadgeList types={coverage.uncovered} lang={lang} compact />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up">
      {defensiveProfiles.teamA && offensiveCoverage.teamA && (
        <SectionCard>
          {renderTeamDefense(teamA, defensiveProfiles.teamA, offensiveCoverage.teamA, threats.teamA, A_COLOR)}
        </SectionCard>
      )}
      {defensiveProfiles.teamB && offensiveCoverage.teamB && (
        <SectionCard>
          {renderTeamDefense(teamB, defensiveProfiles.teamB, offensiveCoverage.teamB, threats.teamB, B_COLOR)}
        </SectionCard>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TAB: Matchups
   ═══════════════════════════════════════════════════════════════ */
const MatchupsTab: React.FC<{
  teamA: Team;
  teamB: Team;
  analysis: ReturnType<typeof useTeamAnalysis>;
  moveMap: Record<string, MoveDetail>;
  resolveSprite: (n: string, i: number) => number;
  lang: string;
}> = ({ teamA, teamB, analysis, moveMap, resolveSprite, lang }) => {
  const { t } = useTranslation();
  const { matchupMatrix } = analysis;

  // Compute SE hit details for the detail section
  const computeMatchupDetails = (attackers: TeamMember[], defenders: TeamMember[]) => {
    const details: { attacker: TeamMember; hits: { defender: TeamMember; types: PokemonType[] }[] }[] = [];
    for (const atk of attackers) {
      const moveTypes = new Set<string>();
      for (const slug of atk.moves ?? []) {
        const detail = moveMap[slug];
        if (detail && detail.damageClass !== 'status') moveTypes.add(detail.type);
      }
      const atkTypes = moveTypes.size > 0 ? Array.from(moveTypes) : atk.pokemon_types;
      const hits: { defender: TeamMember; types: PokemonType[] }[] = [];
      for (const def of defenders) {
        const seTypes: PokemonType[] = [];
        for (const atkType of atkTypes) {
          const mult = abilityAdjustedMultiplier(atkType as PokemonType, def.pokemon_types, def.ability);
          if (mult >= 2) seTypes.push(atkType as PokemonType);
        }
        if (seTypes.length > 0) hits.push({ defender: def, types: seTypes });
      }
      if (hits.length > 0) details.push({ attacker: atk, hits });
    }
    return details;
  };

  const detailsAvsB = useMemo(() => computeMatchupDetails(teamA.members, teamB.members), [teamA.members, teamB.members, moveMap]);
  const detailsBvsA = useMemo(() => computeMatchupDetails(teamB.members, teamA.members), [teamA.members, teamB.members, moveMap]);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* 1v1 Matrix */}
      {matchupMatrix.length > 0 && (
        <SectionCard title={t('compare_matchup_matrix')}>
          <p className="text-sm text-[var(--text-muted)] mb-3">{t('compare_matrix_legend')}</p>
          <div className="overflow-x-auto -mx-1 pb-2">
            <table className="w-full border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="p-1 w-12" />
                  {teamB.members.sort((a, b) => a.slot - b.slot).map(m => (
                    <th key={m.id} className="p-1 text-center">
                      <MemberAvatar member={m} color={B_COLOR} size="sm" resolveSprite={resolveSprite} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamA.members.sort((a, b) => a.slot - b.slot).map((memberA, i) => (
                  <tr key={memberA.id}>
                    <td className="p-1">
                      <MemberAvatar member={memberA} color={A_COLOR} size="sm" resolveSprite={resolveSprite} />
                    </td>
                    {teamB.members.sort((a, b) => a.slot - b.slot).map((memberB, j) => {
                      const cell = matchupMatrix[i]?.[j];
                      if (!cell) return <td key={memberB.id} className="p-1"><div className="w-14 h-14 rounded-lg bg-[var(--color-card-alt)]" /></td>;

                      const hasAtk = cell.atkSE.length > 0;
                      const hasDef = cell.defSE.length > 0;
                      let bg = 'bg-[var(--color-card-alt)]';
                      let borderColor = 'transparent';
                      if (hasAtk && hasDef) { bg = 'bg-amber-500/20'; borderColor = '#F59E0B'; }
                      else if (hasAtk) { bg = 'bg-emerald-500/20'; borderColor = '#10B981'; }
                      else if (hasDef) { bg = 'bg-red-500/20'; borderColor = '#EF4444'; }

                      return (
                        <td key={memberB.id} className="p-0.5">
                          <div
                            className={`w-14 h-14 rounded-lg ${bg} flex items-center justify-center border transition-all hover:scale-110 cursor-default`}
                            style={{ borderColor }}
                            title={`${fmtName(memberA.pokemon_name)} vs ${fmtName(memberB.pokemon_name)}${hasAtk ? ` | SE: ${cell.atkSE.join(', ')}` : ''}${hasDef ? ` | Weak: ${cell.defSE.join(', ')}` : ''}`}
                          >
                            {hasAtk && hasDef ? (
                              <span className="text-amber-500 text-sm font-black">!</span>
                            ) : hasAtk ? (
                              <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                            ) : hasDef ? (
                              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            ) : (
                              <span className="text-[var(--text-muted)] text-[8px]">-</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Detailed matchup lists */}
      {[
        { team: teamA, opponent: teamB, details: detailsAvsB, color: A_COLOR },
        { team: teamB, opponent: teamA, details: detailsBvsA, color: B_COLOR },
      ].map(({ team, opponent, details, color }) => (
        <SectionCard key={team.name + color} title={`${team.name} ${t('compare_team_attacks')} ${opponent.name}`} color={color}>
          {details.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] italic">—</p>
          ) : (
            <div className="space-y-2">
              {details.map(({ attacker, hits }) => (
                <div key={attacker.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
                  <MemberAvatar member={attacker} color={color} resolveSprite={resolveSprite} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-[var(--text-primary)] capitalize mb-1">{fmtName(attacker.pokemon_name)}</p>
                    <div className="flex flex-wrap gap-1">
                      {hits.map(({ defender, types }) => (
                        <span key={defender.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]/50 text-sm">
                          <MemberAvatar member={defender} color={color === A_COLOR ? B_COLOR : A_COLOR} size="sm" resolveSprite={resolveSprite} />
                          {types.map(tp => (
                            <img key={tp} src={getTypeSpriteUrl(tp)} alt={translateType(tp, lang)} className="w-16 h-auto object-contain" />
                          ))}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TAB: Stats — Individual stats per member
   ═══════════════════════════════════════════════════════════════ */
const STAT_LABELS = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'] as const;
const STAT_COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6', '#22C55E', '#EC4899'];

const StatsTab: React.FC<{
  teamA: Team;
  teamB: Team;
  statsMap: Record<number, BaseStats>;
  resolveSprite: (n: string, i: number) => number;
}> = ({ teamA, teamB, statsMap, resolveSprite }) => {
  const { t } = useTranslation();

  // Compute individual stats for all members
  const computeMemberStats = (members: TeamMember[]) =>
    members
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map(m => {
        const base = statsMap[m.pokemon_id];
        const calc = base ? calcAllStats(base, m.nature, m.evs, m.ivs) : null;
        return { member: m, stats: calc };
      });

  const membersA = useMemo(() => computeMemberStats(teamA.members), [teamA.members, statsMap]);
  const membersB = useMemo(() => computeMemberStats(teamB.members), [teamB.members, statsMap]);

  // Speed tiers (interleaved from both teams)
  const speedEntries = useMemo(() => {
    const result: { member: TeamMember; speed: number; team: 'a' | 'b' }[] = [];
    for (const { member, stats } of membersA) {
      if (stats) result.push({ member, speed: stats.spe, team: 'a' });
    }
    for (const { member, stats } of membersB) {
      if (stats) result.push({ member, speed: stats.spe, team: 'b' });
    }
    return result.sort((a, b) => b.speed - a.speed);
  }, [membersA, membersB]);

  const maxSpeed = speedEntries[0]?.speed ?? 1;

  // Find global max stat for bar normalization
  const globalMax = useMemo(() => {
    let max = 1;
    for (const { stats } of [...membersA, ...membersB]) {
      if (!stats) continue;
      max = Math.max(max, stats.hp, stats.atk, stats.def, stats.spa, stats.spd, stats.spe);
    }
    return max;
  }, [membersA, membersB]);

  const renderTeamStats = (entries: ReturnType<typeof computeMemberStats>, color: string, teamName: string) => (
    <SectionCard>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-base font-black uppercase tracking-wider" style={{ color }}>{teamName}</p>
      </div>
      <div className="space-y-4">
        {entries.map(({ member, stats }) => (
          <div key={member.id} className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
            <div className="flex items-center gap-2 mb-3">
              <MemberAvatar member={member} color={color} resolveSprite={resolveSprite} />
              <p className="text-sm font-bold text-[var(--text-primary)] capitalize">{fmtName(member.pokemon_name)}</p>
            </div>
            {stats ? (
              <div className="space-y-1.5">
                {([stats.hp, stats.atk, stats.def, stats.spa, stats.spd, stats.spe] as number[]).map((val, i) => (
                  <div key={STAT_LABELS[i]} className="flex items-center gap-2">
                    <span className="text-sm font-bold w-10 text-right" style={{ color: STAT_COLORS[i] }}>
                      {STAT_LABELS[i]}
                    </span>
                    <div className="flex-1 h-3 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(val / globalMax) * 100}%`, backgroundColor: STAT_COLORS[i] }}
                      />
                    </div>
                    <span className="text-sm font-black tabular-nums w-10 text-right text-[var(--text-primary)]">
                      {val}
                    </span>
                  </div>
                ))}
                <div className="pt-1 border-t border-[var(--color-border)]/30 flex justify-end">
                  <span className="text-sm font-bold text-[var(--text-muted)]">
                    BST: {stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">—</p>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Individual stats side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderTeamStats(membersA, A_COLOR, teamA.name)}
        {renderTeamStats(membersB, B_COLOR, teamB.name)}
      </div>

      {/* Speed tiers */}
      {speedEntries.length > 0 && (
        <SectionCard title={t('compare_speed_tiers')}>
          <div className="space-y-1.5">
            {speedEntries.map(({ member, speed, team }, i) => {
              const color = team === 'a' ? A_COLOR : B_COLOR;
              return (
                <div key={`${member.id}-${i}`} className="flex items-center gap-2">
                  <MemberAvatar member={member} color={color} size="sm" resolveSprite={resolveSprite} />
                  <span className="text-sm font-bold w-32 truncate capitalize text-[var(--text-primary)]">
                    {fmtName(member.pokemon_name)}
                  </span>
                  <div className="flex-1 h-4 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(speed / maxSpeed) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-base font-black tabular-nums w-12 text-right" style={{ color }}>
                    {speed}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TAB: Synergies
   ═══════════════════════════════════════════════════════════════ */
const SynergiesTab: React.FC<{
  teamA: Team;
  teamB: Team;
  analysis: ReturnType<typeof useTeamAnalysis>;
  resolveSprite: (n: string, i: number) => number;
  lang: string;
}> = ({ teamA, teamB, analysis, resolveSprite, lang }) => {
  const { t } = useTranslation();
  const { synergies, threats, roles } = analysis;

  const ROLE_LABELS: Record<MemberRole, string> = {
    phys_attacker: t('compare_role_phys_attacker'),
    spec_attacker: t('compare_role_spec_attacker'),
    phys_wall: t('compare_role_phys_wall'),
    spec_wall: t('compare_role_spec_wall'),
    speedster: t('compare_role_speedster'),
    balanced: t('compare_role_balanced'),
  };

  const ROLE_COLORS: Record<MemberRole, string> = {
    phys_attacker: '#F97316',
    spec_attacker: '#8B5CF6',
    phys_wall: '#0EA5E9',
    spec_wall: '#06B6D4',
    speedster: '#EAB308',
    balanced: '#6B7280',
  };

  const renderTeamSynergies = (team: Team, teamSynergies: typeof synergies.teamA, teamThreats: PokemonType[], color: string) => {
    // Dedupe synergies by coverer+covered pair, grouping types
    const grouped = new Map<string, { coverer: TeamMember; covered: TeamMember; types: PokemonType[] }>();
    for (const s of teamSynergies) {
      const key = `${s.coverer.id}-${s.covered.id}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.types.push(s.type);
      } else {
        grouped.set(key, { coverer: s.coverer, covered: s.covered, types: [s.type] });
      }
    }

    return (
      <SectionCard>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-sm font-black uppercase tracking-wider" style={{ color }}>{team.name}</p>
        </div>

        {/* Role distribution */}
        <div className="mb-4">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('compare_role_coverage')}</p>
          <div className="flex flex-wrap gap-1.5">
            {team.members.sort((a, b) => a.slot - b.slot).map(m => {
              const role = roles.get(m.id) || 'balanced';
              return (
                <div key={m.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)]/50">
                  <MemberAvatar member={m} color={color} size="sm" resolveSprite={resolveSprite} />
                  <span className="text-sm font-bold" style={{ color: ROLE_COLORS[role] }}>
                    {ROLE_LABELS[role]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Synergies */}
        <div className="mb-4">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('compare_synergies_title')}</p>
          {grouped.size === 0 ? (
            <p className="text-base text-[var(--text-muted)] italic">{t('compare_no_synergies')}</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {Array.from(grouped.values()).slice(0, 15).map(({ coverer, covered, types }, i) => (
                <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
                  <MemberAvatar member={coverer} color={color} size="sm" resolveSprite={resolveSprite} />
                  <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <MemberAvatar member={covered} color={color} size="sm" resolveSprite={resolveSprite} />
                  <div className="flex gap-0.5 ml-1">
                    {types.map(tp => (
                      <img key={tp} src={getTypeSpriteUrl(tp)} alt={translateType(tp, lang)} className="w-16 h-auto object-contain" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Critical threats */}
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('compare_critical_threats')}</p>
          <p className="text-sm text-[var(--text-muted)] mb-1.5">{t('compare_critical_threats_desc')}</p>
          {teamThreats.length === 0 ? (
            <p className="text-base text-emerald-500 font-bold">{t('compare_no_threats')}</p>
          ) : (
            <TypeBadgeList types={teamThreats} lang={lang} compact />
          )}
        </div>
      </SectionCard>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up">
      {renderTeamSynergies(teamA, synergies.teamA, threats.teamA, A_COLOR)}
      {renderTeamSynergies(teamB, synergies.teamB, threats.teamB, B_COLOR)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TeamCompare — Main Page
   ═══════════════════════════════════════════════════════════════ */
const TeamCompare: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { teams, loading: teamsLoading } = useTeams();
  const resolveSprite = useSpriteResolver();
  const lang = i18n.language;

  const [teamAId, setTeamAId] = useState<string | null>(null);
  const [teamBId, setTeamBId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const teamA = teams.find(te => te.id === teamAId) ?? null;
  const teamB = teams.find(te => te.id === teamBId) ?? null;

  // Batch data fetching
  const allMoveSlugs = useMemo(() => {
    const slugs = new Set<string>();
    for (const m of [...(teamA?.members ?? []), ...(teamB?.members ?? [])]) {
      for (const s of m.moves ?? []) if (s) slugs.add(s);
    }
    return Array.from(slugs);
  }, [teamA, teamB]);

  const { details: moveMap, loading: movesLoading } = useMoveDetails(allMoveSlugs, lang);

  const allPokemonIds = useMemo(() => {
    const ids = new Set<number>();
    for (const m of [...(teamA?.members ?? []), ...(teamB?.members ?? [])]) ids.add(m.pokemon_id);
    return Array.from(ids);
  }, [teamA, teamB]);

  const { statsMap, loading: statsLoading } = useTeamBaseStats(allPokemonIds);

  const dataLoading = movesLoading || statsLoading;

  // Analysis hook
  const analysis = useTeamAnalysis(teamA, teamB, moveMap, statsMap);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]" style={{ animation: 'pokeball-spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }
  if (!user) return null;

  const bothSelected = teamA && teamB && teamA.members.length > 0 && teamB.members.length > 0;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t('compare_tab_overview'), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg> },
    { id: 'defense', label: t('compare_tab_defense'), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { id: 'matchups', label: t('compare_tab_matchups'), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg> },
    { id: 'stats', label: t('compare_tab_speed_stats'), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: 'synergies', label: t('compare_tab_synergies'), icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  ];

  return (
    <div className="min-h-screen app-bg pt-20 sm:pt-8 pb-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Header */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          <div className="accent-bar" />
          <div className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('compare_title')}
              </h1>
              <p className="text-base sm:text-base text-[var(--text-secondary)] mt-0.5">{t('compare_subtitle')}</p>
            </div>
            <button
              onClick={() => navigate('/teams')}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-card-alt)] hover:bg-[var(--color-border)] text-[var(--text-primary)] font-bold text-base transition-all duration-200 cursor-pointer border border-[var(--color-border)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {t('compare_back')}
            </button>
          </div>
        </div>

        {/* Not enough teams */}
        {!teamsLoading && teams.length < 2 && (
          <div className="text-center py-16 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl">
            <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{t('compare_no_teams')}</p>
          </div>
        )}

        {/* Team selectors */}
        {teams.length >= 2 && (
          <>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl p-3 sm:p-5 animate-slide-up">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                {/* Team A */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black uppercase tracking-wider mb-1.5" style={{ color: A_COLOR }}>{t('compare_team_a')}</p>
                  <select
                    value={teamAId ?? ''}
                    onChange={e => setTeamAId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 bg-[var(--color-card)] text-[var(--text-primary)] text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors"
                    style={{ fontFamily: 'var(--font-display)', borderColor: teamAId ? A_COLOR : 'var(--color-border)' }}
                  >
                    <option value="">{t('compare_select_team')}</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name} ({team.members.length}/6)</option>
                    ))}
                  </select>
                  {teamA && teamA.members.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {teamA.members.sort((a, b) => a.slot - b.slot).map(m => (
                        <MemberAvatar key={m.id} member={m} color={A_COLOR} resolveSprite={resolveSprite} />
                      ))}
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="flex items-center justify-center sm:pt-6">
                  <div className="relative">
                    <span
                      className="text-xl font-black tracking-tight"
                      style={{
                        fontFamily: 'var(--font-display)',
                        background: `linear-gradient(135deg, ${A_COLOR}, ${B_COLOR})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      VS
                    </span>
                  </div>
                </div>

                {/* Team B */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black uppercase tracking-wider mb-1.5" style={{ color: B_COLOR }}>{t('compare_team_b')}</p>
                  <select
                    value={teamBId ?? ''}
                    onChange={e => setTeamBId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 bg-[var(--color-card)] text-[var(--text-primary)] text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors"
                    style={{ fontFamily: 'var(--font-display)', borderColor: teamBId ? B_COLOR : 'var(--color-border)' }}
                  >
                    <option value="">{t('compare_select_team')}</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name} ({team.members.length}/6)</option>
                    ))}
                  </select>
                  {teamB && teamB.members.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {teamB.members.sort((a, b) => a.slot - b.slot).map(m => (
                        <MemberAvatar key={m.id} member={m} color={B_COLOR} resolveSprite={resolveSprite} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loading */}
            {bothSelected && dataLoading && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-600 border-t-[var(--color-primary)] rounded-full animate-spin" />
                  <span className="text-sm text-[var(--text-muted)]">{t('compare_loading')}</span>
                </div>
              </div>
            )}

            {/* Tab bar + Content */}
            {bothSelected && !dataLoading ? (
              <>
                {/* Tabs */}
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-lg p-1 overflow-x-auto animate-slide-up">
                  <div className="flex gap-1 min-w-max">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-[var(--color-primary)] text-white shadow-md'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-card-alt)]'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                <div className="min-h-[300px]">
                  {activeTab === 'overview' && (
                    <OverviewTab teamA={teamA!} teamB={teamB!} analysis={analysis} statsMap={statsMap} resolveSprite={resolveSprite} lang={lang} />
                  )}
                  {activeTab === 'defense' && (
                    <DefenseTab teamA={teamA!} teamB={teamB!} analysis={analysis} lang={lang} />
                  )}
                  {activeTab === 'matchups' && (
                    <MatchupsTab teamA={teamA!} teamB={teamB!} analysis={analysis} moveMap={moveMap} resolveSprite={resolveSprite} lang={lang} />
                  )}
                  {activeTab === 'stats' && (
                    <StatsTab teamA={teamA!} teamB={teamB!} statsMap={statsMap} resolveSprite={resolveSprite} />
                  )}
                  {activeTab === 'synergies' && (
                    <SynergiesTab teamA={teamA!} teamB={teamB!} analysis={analysis} resolveSprite={resolveSprite} lang={lang} />
                  )}
                </div>
              </>
            ) : !bothSelected && (teamA || teamB) ? (
              <div className="text-center py-12 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl">
                <p className="text-sm text-[var(--text-muted)]">{t('compare_select_both')}</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamCompare;
