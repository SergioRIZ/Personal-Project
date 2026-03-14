import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';
import { usePokemonData } from '../../../hooks/usePokemonData';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { useMegaForm } from '../../../hooks/useMegaForm';
import { calculateDamage, DEFAULT_ENVIRONMENT, type CalcPokemon, type CalcMove, type CalcEnvironment } from '../../../lib/damageCalc';
import PokemonPanel, { DEFAULT_PANEL, type PanelState } from './PokemonPanel';
import MoveSelector from './MoveSelector';
import EnvironmentPanel from './EnvironmentPanel';
import DamageResultDisplay from './DamageResultDisplay';

const Calculator = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const lang = settings.language;

  const [attacker, setAttacker] = useState<PanelState>({ ...DEFAULT_PANEL });
  const [defender, setDefender] = useState<PanelState>({ ...DEFAULT_PANEL });
  const [moveSlug, setMoveSlug] = useState<string | null>(null);
  const [env, setEnv] = useState<CalcEnvironment>({ ...DEFAULT_ENVIRONMENT });

  // Fetch full data for attacker/defender
  const { data: atkData } = usePokemonData(attacker.pokemonId, lang);
  const { data: defData } = usePokemonData(defender.pokemonId, lang);

  // Fetch mega form data if active
  const { megaData: atkMega } = useMegaForm(attacker.megaForm);
  const { megaData: defMega } = useMegaForm(defender.megaForm);

  // Fetch move details for selected move
  const moveSlugs = useMemo(() => moveSlug ? [moveSlug] : [], [moveSlug]);
  const { details: moveDetailsMap } = useMoveDetails(moveSlugs, lang);
  const moveDetail = moveSlug ? moveDetailsMap[moveSlug] : null;

  // Calculate damage
  const result = useMemo(() => {
    if (!atkData || !defData || !moveDetail || !moveDetail.power) return null;
    if (moveDetail.damageClass === 'status') return null;

    const atkPoke: CalcPokemon = {
      types: atkMega?.types ?? atkData.types,
      baseStats: atkMega?.baseStats ?? atkData.baseStats,
      evs: attacker.evs,
      ivs: attacker.ivs,
      nature: attacker.nature,
      ability: attacker.ability,
      item: attacker.item,
      level: attacker.level,
      teraType: attacker.teraType,
      currentHPPercent: attacker.currentHPPercent,
    };

    const defPoke: CalcPokemon = {
      types: defMega?.types ?? defData.types,
      baseStats: defMega?.baseStats ?? defData.baseStats,
      evs: defender.evs,
      ivs: defender.ivs,
      nature: defender.nature,
      ability: defender.ability,
      item: defender.item,
      level: defender.level,
      teraType: defender.teraType,
      currentHPPercent: defender.currentHPPercent,
    };

    const move: CalcMove = {
      slug: moveDetail.slug,
      type: moveDetail.type,
      power: moveDetail.power,
      damageClass: moveDetail.damageClass as 'physical' | 'special',
    };

    return calculateDamage(atkPoke, defPoke, move, env);
  }, [atkData, defData, atkMega, defMega, moveDetail, attacker, defender, env]);

  // Swap attacker and defender
  const handleSwap = () => {
    const tempAtk = { ...attacker };
    setAttacker({ ...defender });
    setDefender(tempAtk);
    setMoveSlug(null);
  };

  return (
    <div className="min-h-screen app-bg py-6">
      <div className="container mx-auto px-4 pt-16 sm:pt-10 max-w-5xl">
        {/* ── Rotom Dex Frame ──────────────────────────────── */}
        <div className="relative animate-slide-up mt-6 sm:mt-8">
          {/* Rotom image */}
          <img
            src="/Context/RotomDex.webp"
            alt=""
            aria-hidden="true"
            className="absolute -top-12 -right-4 sm:-top-16 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 object-contain z-30 drop-shadow-lg pointer-events-none select-none"
            style={{ animation: 'hero-sprite-drift 4s ease-in-out infinite' }}
          />

          {/* Dex body */}
          <div className="bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-3xl p-2 sm:p-3 shadow-2xl">
            {/* Screen bezel indicators */}
            <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              <div className="flex-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>

            {/* Screen */}
            <div className="bg-[var(--color-card)] rounded-2xl shadow-inner overflow-hidden border-2 border-white/20">
              {/* Accent bar */}
              <div className="accent-bar" />

              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {t('calc_title', 'Damage Calculator')}
                </h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {t('calc_subtitle', 'Gen 5+ damage formula — calculate your matchups')}
                </p>
              </div>

              {/* Main content */}
              <div className="p-4 sm:p-6">
                {/* Attacker vs Defender panels */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6">
                  {/* Attacker */}
                  <PokemonPanel
                    label={t('calc_attacker', 'Attacker')}
                    accentColor="var(--color-primary)"
                    state={attacker}
                    onChange={setAttacker}
                  />

                  {/* VS divider + swap */}
                  <div className="flex lg:flex-col items-center justify-center gap-2 py-2">
                    <div className="hidden lg:block w-px h-8 bg-[var(--color-border)]" />
                    <button
                      onClick={handleSwap}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      aria-label={t('calc_swap', 'Swap attacker and defender')}
                      title={t('calc_swap', 'Swap')}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    </button>
                    <div className="hidden lg:block w-px h-8 bg-[var(--color-border)]" />
                  </div>

                  {/* Defender */}
                  <PokemonPanel
                    label={t('calc_defender', 'Defender')}
                    accentColor="var(--color-secondary)"
                    state={defender}
                    onChange={setDefender}
                  />
                </div>

                {/* Move + Environment + Results */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6 pt-6 border-t border-[var(--color-border)]">
                  {/* Move Selector */}
                  <div>
                    <MoveSelector
                      moves={atkData?.moves ?? []}
                      lang={lang}
                      selectedMove={moveSlug}
                      onSelect={setMoveSlug}
                    />
                  </div>

                  {/* Environment */}
                  <div>
                    <EnvironmentPanel env={env} onChange={setEnv} />
                  </div>

                  {/* Results */}
                  <div className="lg:border-l lg:border-[var(--color-border)] lg:pl-6">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {t('calc_results', 'Results')}
                    </span>
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-alt)]/50 p-4">
                      <DamageResultDisplay
                        result={result}
                        attackerName={atkData?.name ?? ''}
                        defenderName={defData?.name ?? ''}
                        moveName={moveDetail?.name ?? ''}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bezel */}
            <div className="flex items-center justify-center gap-1 px-3 py-1.5 mt-1">
              <div className="w-8 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
