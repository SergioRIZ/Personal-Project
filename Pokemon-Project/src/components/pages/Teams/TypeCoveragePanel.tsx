import React from 'react';
import { useTranslation } from 'react-i18next';
import { ALL_TYPES, computeTeamDefensive, computeTeamOffensive } from '../../../lib/typeChart';
import { getTypeColor, translateType } from '../Pokedex/utils';
import type { TeamMember } from '../../../lib/teams';

interface Props {
  members: TeamMember[];
}

const TypeCoveragePanel: React.FC<Props> = ({ members }) => {
  const { t, i18n } = useTranslation();

  if (members.length === 0) return null;

  const memberTypes = members.map(m => m.pokemon_types);
  const { weaknesses, immunities, resistances } = computeTeamDefensive(memberTypes);
  const offensive = computeTeamOffensive(memberTypes);

  const weakTypes   = ALL_TYPES.filter(type => weaknesses[type] > 0);
  const immuneTypes = ALL_TYPES.filter(type => immunities[type] > 0);
  const resistTypes = ALL_TYPES.filter(type => resistances[type] > 0);
  const coveredTypes = ALL_TYPES.filter(type => offensive[type]);

  const coveragePct = Math.round((coveredTypes.length / ALL_TYPES.length) * 100);

  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/60 dark:to-gray-700/40 border-b border-gray-200 dark:border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-100 tracking-tight">
          {t('teams_type_coverage')}
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700">

        {/* ── DEFENSIVE ─────────────────────────────────────────── */}
        <div className="p-4 space-y-3.5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
            {t('teams_defensive')}
          </p>

          {/* Weaknesses */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-[11px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">
                {t('teams_weaknesses')}
              </p>
            </div>
            {weakTypes.length === 0 ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">{t('teams_no_weaknesses')}</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {weakTypes.map(type => (
                  <span key={type} className="inline-flex items-center gap-1">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-white text-xs font-bold capitalize shadow-sm border border-white/20 hover:scale-105 transition-all duration-200 ${getTypeColor(type)}`}>
                      {translateType(type, i18n.language)}
                    </span>
                    {weaknesses[type] > 1 && (
                      <span className="text-[10px] font-black text-red-400 dark:text-red-300">
                        ×{weaknesses[type]}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Immunities */}
          {immuneTypes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <p className="text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                  {t('teams_immunities')}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {immuneTypes.map(type => (
                  <span
                    key={type}
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-white text-xs font-bold capitalize shadow-sm border border-white/20 hover:scale-105 transition-all duration-200 ${getTypeColor(type)}`}
                  >
                    {translateType(type, i18n.language)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resistances */}
          {resistTypes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {t('teams_resistances')}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {resistTypes.map(type => (
                  <span
                    key={type}
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-white text-xs font-bold capitalize shadow-sm border border-white/20 opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-200 ${getTypeColor(type)}`}
                  >
                    {translateType(type, i18n.language)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── OFFENSIVE ─────────────────────────────────────────── */}
        <div className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-3">
            {t('teams_offensive')} (STAB)
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${coveragePct}%`,
                  background: coveragePct >= 75
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : coveragePct >= 50
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #ef4444, #dc2626)',
                }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0 tabular-nums">
              {coveredTypes.length}<span className="text-gray-400 dark:text-gray-500 font-normal">/{ALL_TYPES.length}</span>
            </span>
          </div>

          {coveredTypes.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              {t('teams_no_coverage')}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {coveredTypes.map(type => (
                <span
                  key={type}
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-white text-xs font-bold capitalize shadow-sm border border-white/20 hover:scale-105 transition-all duration-200 ${getTypeColor(type)}`}
                >
                  {translateType(type, i18n.language)}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TypeCoveragePanel;
