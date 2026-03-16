import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTeams } from '../../../context/TeamsContext';
import { navigate } from '../../../navigation';
import { ALL_TYPES, computeTeamDefensive, computeTeamOffensive, computeDefensiveMultiplier } from '../../../lib/typeChart';
import { translateType, getTypeSpriteUrl } from '../Pokedex/utils';
import type { Team, TeamMember } from '../../../lib/teams';
import type { PokemonType } from '../../../lib/typeChart';

/* ─── Helpers ────────────────────────────────────────────────── */

/** Count how many members of `defenders` each STAB type from `attackers` hits super-effectively */
function computeMatchupScore(attackers: TeamMember[], defenders: TeamMember[]): {
  total: number;
  details: { attacker: TeamMember; defenderHits: { defender: TeamMember; types: PokemonType[] }[] }[];
} {
  let total = 0;
  const details: { attacker: TeamMember; defenderHits: { defender: TeamMember; types: PokemonType[] }[] }[] = [];

  for (const atk of attackers) {
    const defenderHits: { defender: TeamMember; types: PokemonType[] }[] = [];
    for (const def of defenders) {
      const seTypes: PokemonType[] = [];
      for (const stabType of atk.pokemon_types) {
        const mult = computeDefensiveMultiplier(stabType as PokemonType, def.pokemon_types);
        if (mult >= 2) seTypes.push(stabType as PokemonType);
      }
      if (seTypes.length > 0) {
        total += seTypes.length;
        defenderHits.push({ defender: def, types: seTypes });
      }
    }
    if (defenderHits.length > 0) details.push({ attacker: atk, defenderHits });
  }

  return { total, details };
}

/* ─── Sub-components ─────────────────────────────────────────── */

const TeamSelector: React.FC<{
  label: string;
  teams: Team[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  color: string;
}> = ({ label, teams, selectedId, onSelect, color }) => {
  const { t } = useTranslation();
  const selected = teams.find(t => t.id === selectedId);

  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color }}>{label}</p>
      <select
        value={selectedId ?? ''}
        onChange={e => onSelect(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--text-primary)] text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{ fontFamily: 'var(--font-display)', focusRingColor: color } as React.CSSProperties}
      >
        <option value="">{t('compare_select_team')}</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>{team.name} ({team.members.length}/6)</option>
        ))}
      </select>
      {/* Mini sprites */}
      {selected && selected.members.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {selected.members.sort((a, b) => a.slot - b.slot).map(m => (
            <div key={m.id} className="w-12 h-12 rounded-full bg-[var(--color-card-alt)] flex items-center justify-center border-2 overflow-hidden" style={{ borderColor: color }}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.pokemon_id}.png`}
                alt={m.pokemon_name}
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TypeBadgeList: React.FC<{
  types: PokemonType[];
  counts?: Record<PokemonType, number>;
  lang: string;
}> = ({ types, counts, lang }) => {
  if (types.length === 0) return <p className="text-sm text-[var(--text-muted)] italic">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {types.map(type => (
        <span key={type} className="inline-flex items-center gap-0.5">
          <img
            src={getTypeSpriteUrl(type)}
            alt={translateType(type, lang)}
            title={translateType(type, lang)}
            className="w-16 h-auto object-contain drop-shadow-md hover:scale-110 transition-transform duration-200"
          />
          {counts && counts[type] > 1 && (
            <span className="text-xs font-black text-[var(--text-muted)]">×{counts[type]}</span>
          )}
        </span>
      ))}
    </div>
  );
};

const DefensiveSection: React.FC<{
  team: Team;
  color: string;
  lang: string;
}> = ({ team, color, lang }) => {
  const { t } = useTranslation();
  const memberTypes = team.members.map(m => m.pokemon_types);
  const { weaknesses, immunities, resistances } = computeTeamDefensive(memberTypes);
  const offensive = computeTeamOffensive(memberTypes);

  const weakTypes = ALL_TYPES.filter(type => weaknesses[type] > 0);
  const immuneTypes = ALL_TYPES.filter(type => immunities[type] > 0);
  const resistTypes = ALL_TYPES.filter(type => resistances[type] > 0);
  const coveredTypes = ALL_TYPES.filter(type => offensive[type]);

  return (
    <div className="space-y-4">
      {/* Defensive */}
      <div>
        <p className="text-sm font-black uppercase tracking-wider mb-2" style={{ color }}>{t('compare_defensive_profile')}</p>
        <div className="space-y-3 p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/50">
          <div>
            <p className="text-xs font-bold text-red-500 mb-1.5">{t('compare_weaknesses')} ({weakTypes.length})</p>
            <TypeBadgeList types={weakTypes} counts={weaknesses} lang={lang} />
          </div>
          {resistTypes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-emerald-500 mb-1.5">{t('compare_resistances')} ({resistTypes.length})</p>
              <TypeBadgeList types={resistTypes} counts={resistances} lang={lang} />
            </div>
          )}
          {immuneTypes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1.5">{t('compare_immunities')} ({immuneTypes.length})</p>
              <TypeBadgeList types={immuneTypes} counts={immunities} lang={lang} />
            </div>
          )}
        </div>
      </div>

      {/* Offensive */}
      <div>
        <p className="text-sm font-black uppercase tracking-wider mb-2" style={{ color }}>{t('compare_offensive_coverage')}</p>
        <div className="p-3 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(coveredTypes.length / ALL_TYPES.length) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-sm font-black tabular-nums text-[var(--text-primary)]">{coveredTypes.length}/{ALL_TYPES.length}</span>
          </div>
          <TypeBadgeList types={coveredTypes} lang={lang} />
        </div>
      </div>
    </div>
  );
};

/* ─── Matchup Section ────────────────────────────────────────── */

const MatchupSection: React.FC<{
  teamA: Team;
  teamB: Team;
  lang: string;
}> = ({ teamA, teamB, lang }) => {
  const { t } = useTranslation();

  const scoreAvsB = useMemo(() => computeMatchupScore(teamA.members, teamB.members), [teamA.members, teamB.members]);
  const scoreBvsA = useMemo(() => computeMatchupScore(teamB.members, teamA.members), [teamA.members, teamB.members]);

  const aColor = '#3B82F6';
  const bColor = '#EF4444';

  const maxScore = Math.max(scoreAvsB.total, scoreBvsA.total, 1);

  return (
    <div className="space-y-6">
      {/* Score comparison */}
      <div className="p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
        <p className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] mb-4 text-center">
          {t('compare_super_effective')}
        </p>

        {/* Visual bar comparison */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-24 truncate text-right" style={{ color: aColor }}>{teamA.name}</span>
            <div className="flex-1 h-4 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(scoreAvsB.total / maxScore) * 100}%`, backgroundColor: aColor }}
              />
            </div>
            <span className="text-lg font-black tabular-nums w-8" style={{ color: aColor }}>{scoreAvsB.total}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-24 truncate text-right" style={{ color: bColor }}>{teamB.name}</span>
            <div className="flex-1 h-4 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(scoreBvsA.total / maxScore) * 100}%`, backgroundColor: bColor }}
              />
            </div>
            <span className="text-lg font-black tabular-nums w-8" style={{ color: bColor }}>{scoreBvsA.total}</span>
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">{t('compare_verdict')}</p>
          {scoreAvsB.total > scoreBvsA.total ? (
            <p className="text-base font-black" style={{ color: aColor }}>
              {teamA.name} {t('compare_verdict_a')}
            </p>
          ) : scoreBvsA.total > scoreAvsB.total ? (
            <p className="text-base font-black" style={{ color: bColor }}>
              {teamB.name} {t('compare_verdict_b')}
            </p>
          ) : (
            <p className="text-base font-black text-[var(--text-primary)]">
              {t('compare_verdict_tie')}
            </p>
          )}
        </div>
      </div>

      {/* Detailed matchup: A attacks B */}
      <MatchupDetail
        attackTeam={teamA}
        defendTeam={teamB}
        result={scoreAvsB}
        color={aColor}
        lang={lang}
      />
      {/* Detailed matchup: B attacks A */}
      <MatchupDetail
        attackTeam={teamB}
        defendTeam={teamA}
        result={scoreBvsA}
        color={bColor}
        lang={lang}
      />
    </div>
  );
};

const MatchupDetail: React.FC<{
  attackTeam: Team;
  defendTeam: Team;
  result: ReturnType<typeof computeMatchupScore>;
  color: string;
  lang: string;
}> = ({ attackTeam, defendTeam, result, color, lang }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
      <p className="text-sm font-black uppercase tracking-wider mb-3" style={{ color }}>
        {attackTeam.name} {t('compare_team_attacks')} {defendTeam.name}
      </p>
      {result.details.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] italic">—</p>
      ) : (
        <div className="space-y-2">
          {result.details.map(({ attacker, defenderHits }) => (
            <div key={attacker.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[var(--color-card-alt)]/50 border border-[var(--color-border)]/30">
              {/* Attacker sprite */}
              <div className="w-10 h-10 rounded-full bg-[var(--color-card)] flex items-center justify-center shrink-0 border-2 overflow-hidden" style={{ borderColor: color }}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${attacker.pokemon_id}.png`}
                  alt={attacker.pokemon_name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
              </div>
              {/* Hits */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--text-primary)] capitalize mb-1">{attacker.pokemon_name.replace(/-/g, ' ')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {defenderHits.map(({ defender, types }) => (
                    <span key={defender.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]/50 text-[11px]">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${defender.pokemon_id}.png`}
                        alt={defender.pokemon_name}
                        className="w-5 h-5 object-contain"
                        loading="lazy"
                      />
                      {types.map(tp => (
                        <img
                          key={tp}
                          src={getTypeSpriteUrl(tp)}
                          alt={translateType(tp, lang)}
                          className="w-10 h-auto object-contain"
                        />
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TeamCompare — main page
   ═══════════════════════════════════════════════════════════════ */

const TeamCompare: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { teams, loading: teamsLoading } = useTeams();
  const lang = i18n.language;

  const [teamAId, setTeamAId] = useState<string | null>(null);
  const [teamBId, setTeamBId] = useState<string | null>(null);

  const teamA = teams.find(t => t.id === teamAId) ?? null;
  const teamB = teams.find(t => t.id === teamBId) ?? null;

  // Auth redirect
  React.useEffect(() => {
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

  const aColor = '#3B82F6';
  const bColor = '#EF4444';

  return (
    <div className="min-h-screen app-bg pt-20 sm:pt-8 pb-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          <div className="accent-bar" />
          <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('compare_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                {t('compare_subtitle')}
              </p>
            </div>
            <button
              onClick={() => navigate('/teams')}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-card-alt)] hover:bg-[var(--color-border)] text-[var(--text-primary)] font-bold text-sm transition-all duration-200 cursor-pointer border border-[var(--color-border)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {t('compare_back')}
            </button>
          </div>
        </div>

        {/* Not enough teams */}
        {!teamsLoading && teams.length < 2 && (
          <div className="text-center py-16 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl">
            <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {t('compare_no_teams')}
            </p>
          </div>
        )}

        {/* Team selectors */}
        {teams.length >= 2 && (
          <>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl p-4 sm:p-6 animate-slide-up">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                <TeamSelector label={t('compare_team_a')} teams={teams} selectedId={teamAId} onSelect={setTeamAId} color={aColor} />
                <div className="flex items-center justify-center sm:pt-8">
                  <span className="text-2xl font-black text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('compare_vs')}
                  </span>
                </div>
                <TeamSelector label={t('compare_team_b')} teams={teams} selectedId={teamBId} onSelect={setTeamBId} color={bColor} />
              </div>
            </div>

            {/* Comparison content */}
            {teamA && teamB && teamA.members.length > 0 && teamB.members.length > 0 ? (
              <div className="space-y-6 animate-slide-up">
                {/* Side-by-side defensive/offensive profiles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl p-4 sm:p-6">
                    <DefensiveSection team={teamA} color={aColor} lang={lang} />
                  </div>
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl p-4 sm:p-6">
                    <DefensiveSection team={teamB} color={bColor} lang={lang} />
                  </div>
                </div>

                {/* Matchup analysis */}
                <MatchupSection teamA={teamA} teamB={teamB} lang={lang} />
              </div>
            ) : (teamA || teamB) && (
              <div className="text-center py-12 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl">
                <p className="text-sm text-[var(--text-muted)]">{t('compare_select_both')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamCompare;
