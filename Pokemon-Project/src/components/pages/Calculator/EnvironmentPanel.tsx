import { useTranslation } from 'react-i18next';
import type { CalcEnvironment, Weather, Terrain } from '../../../lib/damageCalc';

interface Props {
  env: CalcEnvironment;
  onChange: (env: CalcEnvironment) => void;
}

const WEATHERS: { value: Weather; icon: string; label: string }[] = [
  { value: 'none', icon: '—',  label: 'None' },
  { value: 'sun',  icon: '☀️', label: 'Sun' },
  { value: 'rain', icon: '🌧️', label: 'Rain' },
  { value: 'sand', icon: '🏜️', label: 'Sand' },
  { value: 'snow', icon: '❄️', label: 'Snow' },
];

const TERRAINS: { value: Terrain; icon: string; label: string }[] = [
  { value: 'none',     icon: '—',  label: 'None' },
  { value: 'electric', icon: '⚡', label: 'Electric' },
  { value: 'grassy',   icon: '🌿', label: 'Grassy' },
  { value: 'psychic',  icon: '🔮', label: 'Psychic' },
  { value: 'misty',    icon: '🌫️', label: 'Misty' },
];

const EnvironmentPanel = ({ env, onChange }: Props) => {
  const { t } = useTranslation();

  const chipClass = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
      active
        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
        : 'bg-[var(--color-card-alt)] text-[var(--text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:text-[var(--text-primary)]'
    }`;

  return (
    <div className="flex flex-col gap-3">
      {/* Weather */}
      <div>
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
          {t('calc_weather', 'Weather')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {WEATHERS.map(w => (
            <button key={w.value} onClick={() => onChange({ ...env, weather: w.value })} className={chipClass(env.weather === w.value)}>
              <span className="mr-1">{w.icon}</span> {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terrain */}
      <div>
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
          {t('calc_terrain', 'Terrain')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TERRAINS.map(tr => (
            <button key={tr.value} onClick={() => onChange({ ...env, terrain: tr.value })} className={chipClass(env.terrain === tr.value)}>
              <span className="mr-1">{tr.icon}</span> {tr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles row */}
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={env.isCriticalHit}
            onChange={e => onChange({ ...env, isCriticalHit: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-[var(--color-primary)]"
          />
          <span className="text-xs font-semibold text-[var(--text-primary)]">{t('calc_crit', 'Critical Hit')}</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={env.isDoubles}
            onChange={e => onChange({ ...env, isDoubles: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-[var(--color-primary)]"
          />
          <span className="text-xs font-semibold text-[var(--text-primary)]">{t('calc_doubles', 'Doubles')}</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={env.isBurned}
            onChange={e => onChange({ ...env, isBurned: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-[var(--color-primary)]"
          />
          <span className="text-xs font-semibold text-[var(--text-primary)]">{t('calc_burn', 'Burned')}</span>
        </label>
      </div>

      {/* Stat boosts */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {t('calc_atk_boost', 'Atk/SpA Boost')}
          </label>
          <div className="flex items-center gap-1">
            <button onClick={() => onChange({ ...env, attackerBoost: Math.max(-6, env.attackerBoost - 1) })} className="w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer text-sm font-bold">−</button>
            <span className={`flex-1 text-center text-sm font-black tabular-nums ${env.attackerBoost > 0 ? 'text-green-500' : env.attackerBoost < 0 ? 'text-red-400' : 'text-[var(--text-primary)]'}`} style={{ fontFamily: 'var(--font-display)' }}>
              {env.attackerBoost > 0 ? '+' : ''}{env.attackerBoost}
            </span>
            <button onClick={() => onChange({ ...env, attackerBoost: Math.min(6, env.attackerBoost + 1) })} className="w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer text-sm font-bold">+</button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {t('calc_def_boost', 'Def/SpD Boost')}
          </label>
          <div className="flex items-center gap-1">
            <button onClick={() => onChange({ ...env, defenderBoost: Math.max(-6, env.defenderBoost - 1) })} className="w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer text-sm font-bold">−</button>
            <span className={`flex-1 text-center text-sm font-black tabular-nums ${env.defenderBoost > 0 ? 'text-green-500' : env.defenderBoost < 0 ? 'text-red-400' : 'text-[var(--text-primary)]'}`} style={{ fontFamily: 'var(--font-display)' }}>
              {env.defenderBoost > 0 ? '+' : ''}{env.defenderBoost}
            </span>
            <button onClick={() => onChange({ ...env, defenderBoost: Math.min(6, env.defenderBoost + 1) })} className="w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer text-sm font-bold">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentPanel;
