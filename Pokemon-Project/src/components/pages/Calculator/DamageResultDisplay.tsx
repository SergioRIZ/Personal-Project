import { useTranslation } from 'react-i18next';
import type { DamageResult } from '../../../lib/damageCalc';

interface Props {
  result: DamageResult | null;
  attackerName: string;
  defenderName: string;
  moveName: string;
}

const DamageResultDisplay = ({ result, attackerName, defenderName, moveName }: Props) => {
  const { t } = useTranslation();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-[var(--text-muted)] gap-2">
        <svg className="w-10 h-10 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6h.006v.008h-.006v-.008zm0 2.25h.006v.008h-.006v-.008zm0 2.25h.006v.008h-.006v-.008zm0 2.25h.006v.008h-.006v-.008zm2.505-6h.005v.008h-.005v-.008zm0 2.25h.005v.008h-.005v-.008zm0 2.25h.005v.008h-.005v-.008zm0 2.25h.005v.008h-.005v-.008zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
        </svg>
        <p className="text-xs font-semibold">{t('calc_select_all', 'Select attacker, defender, and move')}</p>
      </div>
    );
  }

  // Effectiveness label
  let effLabel = t('calc_neutral', 'Neutral');
  let effColor = 'text-[var(--text-muted)]';
  let effBg = 'bg-[var(--color-card-alt)]';
  if (result.effectiveness === 0) { effLabel = t('calc_immune', 'Immune'); effColor = 'text-gray-400'; effBg = 'bg-gray-100 dark:bg-gray-800'; }
  else if (result.effectiveness >= 4) { effLabel = t('calc_super_effective_4x', 'Super Effective ×4'); effColor = 'text-red-500'; effBg = 'bg-red-50 dark:bg-red-900/20'; }
  else if (result.effectiveness >= 2) { effLabel = t('calc_super_effective', 'Super Effective'); effColor = 'text-red-500'; effBg = 'bg-red-50 dark:bg-red-900/20'; }
  else if (result.effectiveness <= 0.25) { effLabel = t('calc_not_effective_025', 'Not Effective ×0.25'); effColor = 'text-blue-400'; effBg = 'bg-blue-50 dark:bg-blue-900/20'; }
  else if (result.effectiveness < 1) { effLabel = t('calc_not_effective', 'Not Very Effective'); effColor = 'text-blue-400'; effBg = 'bg-blue-50 dark:bg-blue-900/20'; }

  // KO color
  const isOHKO = result.koChance.includes('OHKO');
  const is2HKO = result.koChance.includes('2HKO');
  const koColor = isOHKO ? 'text-red-500' : is2HKO ? 'text-amber-500' : 'text-[var(--text-secondary)]';

  // HP bar widths
  const minBarPct = Math.min(100, result.minPercent);
  const maxBarPct = Math.min(100, result.maxPercent);
  const remainingMin = Math.max(0, 100 - maxBarPct);
  const remainingMax = Math.max(0, 100 - minBarPct);

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Battle summary line */}
      <p className="text-xs text-center text-[var(--text-secondary)] font-medium leading-relaxed">
        <span className="font-bold text-[var(--color-primary)] capitalize">{attackerName.replace(/-/g, ' ')}</span>
        {' '}{t('calc_uses', 'uses')}{' '}
        <span className="font-bold text-[var(--text-primary)]">{moveName}</span>
        {' '}{t('calc_on', 'on')}{' '}
        <span className="font-bold text-[var(--color-secondary)] capitalize">{defenderName.replace(/-/g, ' ')}</span>
        {result.isStab && <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 uppercase">STAB</span>}
      </p>

      {/* Effectiveness badge */}
      <div className="flex justify-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${effColor} ${effBg}`}>
          {effLabel}
        </span>
      </div>

      {/* Main damage numbers */}
      {result.effectiveness > 0 && (
        <>
          <div className="text-center">
            <p className="text-3xl font-black tabular-nums text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {result.minDamage} — {result.maxDamage}
            </p>
            <p className="text-sm font-bold text-[var(--text-muted)] tabular-nums mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              {result.minPercent.toFixed(1)}% — {result.maxPercent.toFixed(1)}%
            </p>
          </div>

          {/* HP bar visualization */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                {t('calc_defender_hp', 'Defender HP')}
              </span>
              <span className="text-[10px] font-bold text-[var(--text-primary)] tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                {result.defenderHP} HP
              </span>
            </div>
            <div className="h-6 rounded-full overflow-hidden bg-[var(--color-card-alt)] border border-[var(--color-border)] relative">
              {/* Remaining HP (green) */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${remainingMax}%` }}
              />
              {/* Damage zone (striped red/green overlap) */}
              <div
                className="absolute inset-y-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-60 transition-all duration-500"
                style={{ left: `${remainingMin}%`, width: `${Math.max(0, remainingMax - remainingMin)}%` }}
              />
              {/* Damage (red) */}
              <div
                className="absolute inset-y-0 right-0 bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
                style={{ width: `${maxBarPct}%` }}
              />
              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-white drop-shadow-md tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                  {Math.max(0, result.defenderHP - result.maxDamage)} — {Math.max(0, result.defenderHP - result.minDamage)} HP
                </span>
              </div>
            </div>
          </div>

          {/* KO Chance */}
          <div className="text-center">
            <span className={`text-lg font-black ${koColor}`} style={{ fontFamily: 'var(--font-display)' }}>
              {result.koChance}
            </span>
          </div>

          {/* All 16 rolls */}
          <details className="text-[var(--text-muted)]">
            <summary className="text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
              {t('calc_all_rolls', 'All 16 damage rolls')}
            </summary>
            <div className="mt-2 flex flex-wrap gap-1">
              {result.rolls.map((roll, i) => (
                <span key={i} className="px-1.5 py-0.5 text-[10px] font-bold tabular-nums rounded bg-[var(--color-card-alt)] border border-[var(--color-border)]/50 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {roll}
                </span>
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  );
};

export default DamageResultDisplay;
