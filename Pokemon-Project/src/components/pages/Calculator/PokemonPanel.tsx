import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePokemonData } from '../../../hooks/usePokemonData';
import { useMegaForm } from '../../../hooks/useMegaForm';
import { useItemList } from '../../../hooks/useItemList';
import { getTypeSpriteUrl, translateType } from '../Pokedex/utils';
import { NATURES, getNatureModifiers, translateNature } from '../../../lib/natures';
import { calcStat, DEFAULT_EVS, DEFAULT_IVS } from '../../../lib/damageCalc';
import type { BaseStats } from '../../../hooks/usePokemonBaseStats';
import PokemonSearchInput from './PokemonSearchInput';
import type { PokemonEntry, FormType } from '../../../hooks/usePokemonSearch';

const FORM_BADGE: Record<FormType, { gradient: string; labelKey: string; fallback: string }> = {
  mega:   { gradient: 'from-amber-500 to-pink-500',    labelKey: 'calc_mega',    fallback: 'Mega' },
  alola:  { gradient: 'from-sky-400 to-cyan-500',      labelKey: 'calc_alola',   fallback: 'Alola' },
  galar:  { gradient: 'from-purple-500 to-indigo-500', labelKey: 'calc_galar',   fallback: 'Galar' },
  hisui:  { gradient: 'from-amber-600 to-yellow-500',  labelKey: 'calc_hisui',   fallback: 'Hisui' },
  paldea: { gradient: 'from-orange-500 to-red-500',    labelKey: 'calc_paldea',  fallback: 'Paldea' },
  gmax:   { gradient: 'from-rose-500 to-red-600',      labelKey: 'calc_gmax',    fallback: 'GMax' },
  alt:    { gradient: 'from-teal-500 to-emerald-500', labelKey: 'calc_alt',     fallback: 'Form' },
};

const SPRITE_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const TERA_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'stellar',
];

const STAT_ORDER: (keyof BaseStats)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_DISPLAY: Record<keyof BaseStats, string> = {
  hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
};
const STAT_COLORS: Record<keyof BaseStats, string> = {
  hp:  'from-rose-500 to-red-500',
  atk: 'from-amber-500 to-orange-500',
  def: 'from-yellow-500 to-amber-500',
  spa: 'from-blue-500 to-indigo-500',
  spd: 'from-emerald-500 to-green-500',
  spe: 'from-violet-500 to-purple-500',
};
const STAT_TEXT: Record<keyof BaseStats, string> = {
  hp:  'text-rose-500', atk: 'text-amber-500', def: 'text-yellow-500',
  spa: 'text-blue-500', spd: 'text-emerald-500', spe: 'text-violet-500',
};

export interface PanelState {
  pokemonId: number | null;
  nature: string;
  ability: string | null;
  item: string | null;
  evs: Record<keyof BaseStats, number>;
  ivs: Record<keyof BaseStats, number>;
  level: number;
  teraType: string | null;
  currentHPPercent: number;
  megaForm: string | null;
  formType: FormType | null;
}

export const DEFAULT_PANEL: PanelState = {
  pokemonId: null,
  nature: 'Hardy',
  ability: null,
  item: null,
  evs: { ...DEFAULT_EVS },
  ivs: { ...DEFAULT_IVS },
  level: 50,
  teraType: null,
  currentHPPercent: 100,
  megaForm: null,
  formType: null,
};

interface Props {
  label: string;
  accentColor: string;
  state: PanelState;
  onChange: (state: PanelState) => void;
}

const PokemonPanel = ({ label, accentColor, state, onChange }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data, loading } = usePokemonData(state.pokemonId, lang);
  const { megaData } = useMegaForm(state.megaForm);
  const { items: allItems } = useItemList(lang);
  const [itemInput, setItemInput] = useState('');
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);

  const natureMods = useMemo(() => getNatureModifiers(state.nature), [state.nature]);

  // Effective stats: mega overrides base stats if active
  const effectiveBaseStats = megaData?.baseStats ?? data?.baseStats;
  const effectiveTypes = megaData?.types ?? data?.types ?? [];

  // Auto-select first non-hidden ability when pokemon loads
  const abilities = data?.abilities ?? [];
  if (data && !state.ability && abilities.length > 0) {
    const first = abilities.find(a => !a.isHidden) ?? abilities[0];
    onChange({ ...state, ability: first.slug });
  }

  // Sync item input with selected item name
  useEffect(() => {
    if (!state.item) { setItemInput(''); return; }
    const match = allItems.find(i => i.slug === state.item || i.name.toLowerCase() === state.item!.toLowerCase());
    if (match) setItemInput(match.name);
  }, [state.item, allItems]);

  const calcStats = useMemo(() => {
    if (!effectiveBaseStats) return null;
    const result: Record<string, number> = {};
    for (const s of STAT_ORDER) {
      result[s] = calcStat(effectiveBaseStats[s], state.evs[s], state.ivs[s], s === 'hp', s === 'hp' ? 1 : natureMods[s], state.level);
    }
    return result as Record<keyof BaseStats, number>;
  }, [effectiveBaseStats, state.evs, state.ivs, state.level, natureMods]);

  const handleSelect = (p: PokemonEntry | null) => {
    if (!p) { onChange({ ...DEFAULT_PANEL }); return; }
    onChange({ ...state, pokemonId: p.id, ability: null, megaForm: p.megaForm ?? null, formType: p.formType ?? null });
  };

  // Filtered items for dropdown
  const filteredItems = useMemo(() => {
    const q = itemInput.toLowerCase().trim();
    if (!q) return allItems;
    return allItems.filter(i => i.name.toLowerCase().includes(q) || i.slug.includes(q));
  }, [allItems, itemInput]);

  // Matched item for sprite display
  const matchedItem = useMemo(() => {
    if (!state.item) return null;
    return allItems.find(i => i.slug === state.item || i.name.toLowerCase() === state.item!.toLowerCase()) ?? null;
  }, [state.item, allItems]);

  const handleItemBlur = () => {
    setTimeout(() => {
      setItemDropdownOpen(false);
      // Try to match input to an item
      if (!itemInput.trim()) { onChange({ ...state, item: null }); return; }
      const q = itemInput.toLowerCase().trim();
      const match = allItems.find(i => i.name.toLowerCase() === q || i.slug === q || i.slug === q.replace(/\s+/g, '-'));
      if (match) onChange({ ...state, item: match.slug });
    }, 150);
  };

  // Value for PokemonSearchInput — include form info
  const searchValue: PokemonEntry | null = state.pokemonId && data
    ? { id: data.id, name: data.name, megaForm: state.megaForm ?? undefined, displayName: state.megaForm ? state.megaForm.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : undefined, formType: state.formType ?? undefined }
    : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Header label */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-6 rounded-full" style={{ background: accentColor }} />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          {label}
        </h2>
      </div>

      {/* Search — includes mega forms as separate entries */}
      <PokemonSearchInput
        value={searchValue}
        onSelect={handleSelect}
        placeholder={t('calc_search_pokemon', 'Search Pokémon...')}
      />

      {/* Pokemon preview */}
      {data && (
        <>
          {/* Sprite + types */}
          <div className="relative flex flex-col items-center py-4 rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor}18, transparent)` }}>
            {/* Pokeball watermark */}
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="w-28 h-28 opacity-[0.05]">
                <circle cx="100" cy="100" r="93" stroke={accentColor} strokeWidth="4" fill="none" />
                <line x1="7" y1="100" x2="193" y2="100" stroke={accentColor} strokeWidth="4" />
                <circle cx="100" cy="100" r="24" stroke={accentColor} strokeWidth="4" fill="none" />
              </svg>
            </div>

            {/* Form badge (Mega / Regional / GMax) */}
            {state.formType && FORM_BADGE[state.formType] && (
              <span className={`absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${FORM_BADGE[state.formType].gradient} text-white shadow-md`}>
                {t(FORM_BADGE[state.formType].labelKey, FORM_BADGE[state.formType].fallback).toUpperCase()}
              </span>
            )}

            <img
              src={SPRITE_URL(megaData?.spriteId ?? data.id)}
              alt={data.name}
              loading="lazy"
              className="relative z-10 w-24 h-24 object-contain drop-shadow-lg"
              onError={e => {
                const fallbackId = megaData?.spriteId ?? data.id;
                (e.target as HTMLImageElement).src =
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fallbackId}.png`;
              }}
            />
            <div className="flex gap-2 mt-2 relative z-10">
              {effectiveTypes.map(type => (
                <img key={type} src={getTypeSpriteUrl(type)} alt={type} className="w-14 h-auto object-contain drop-shadow" />
              ))}
            </div>
          </div>

          {/* Nature + Ability row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {t('calc_nature', 'Nature')}
              </label>
              <select
                value={state.nature}
                onChange={e => onChange({ ...state, nature: e.target.value })}
                className="w-full px-2 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 cursor-pointer"
              >
                {NATURES.map(([name]) => (
                  <option key={name} value={name}>{translateNature(name, lang)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {t('calc_ability', 'Ability')}
              </label>
              <select
                value={state.ability ?? ''}
                onChange={e => onChange({ ...state, ability: e.target.value || null })}
                className="w-full px-2 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 cursor-pointer"
              >
                {abilities.map(a => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}{a.isHidden ? ` ${t('calc_hidden_ability', '(H)')}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level — custom stepper */}
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {t('calc_level', 'Level')}
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChange({ ...state, level: Math.max(1, state.level - 1) })}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer text-sm font-bold"
                aria-label="Decrease level"
              >−</button>
              <input
                type="number"
                min={1}
                max={100}
                value={state.level}
                onChange={e => onChange({ ...state, level: Math.max(1, Math.min(100, Number(e.target.value) || 50)) })}
                className="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 tabular-nums text-center"
                style={{ fontFamily: 'var(--font-display)' }}
              />
              <button
                onClick={() => onChange({ ...state, level: Math.min(100, state.level + 1) })}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer text-sm font-bold"
                aria-label="Increase level"
              >+</button>
              <div className="flex gap-0.5 ml-1">
                {[50, 100].map(lv => (
                  <button
                    key={lv}
                    onClick={() => onChange({ ...state, level: lv })}
                    className={`px-1.5 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                      state.level === lv
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-card-alt)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--color-border)]'
                    }`}
                  >{lv}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Item — styled like TeamMemberEditor */}
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {t('calc_item', 'Item')}
            </label>
            <div className="relative">
              <div className="relative flex items-center">
                {matchedItem && (
                  <img
                    src={matchedItem.sprite}
                    alt={matchedItem.name}
                    className="absolute left-2 w-5 h-5 object-contain pointer-events-none z-10"
                    onError={e => { (e.target as HTMLImageElement).src = matchedItem.spriteFallback; }}
                  />
                )}
                <input
                  type="text"
                  value={itemInput}
                  onChange={e => { setItemInput(e.target.value); setItemDropdownOpen(true); if (state.item) onChange({ ...state, item: null }); }}
                  onFocus={() => setItemDropdownOpen(true)}
                  onBlur={handleItemBlur}
                  placeholder={t('calc_search_item', 'Search item...')}
                  aria-label={t('calc_item', 'Item')}
                  className={`w-full py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${matchedItem ? 'pl-8 pr-7' : 'px-2 pr-7'}`}
                />
              </div>
              {itemInput && (
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setItemInput(''); onChange({ ...state, item: null }); }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
                  aria-label="Clear item"
                >
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              )}
              {itemDropdownOpen && filteredItems.length > 0 && (
                <div className="absolute z-30 left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl">
                  {filteredItems.slice(0, 25).map(item => (
                    <button
                      key={item.slug}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setItemInput(item.name); onChange({ ...state, item: item.slug }); setItemDropdownOpen(false); }}
                      className="w-full text-left px-2.5 py-1.5 flex items-start gap-2 hover:bg-[var(--color-primary)]/10 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <img
                        src={item.sprite}
                        alt={item.name}
                        className="w-6 h-6 object-contain shrink-0 mt-0.5"
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).src = item.spriteFallback; }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{item.name}</p>
                        {item.desc && (
                          <p className="text-[9px] text-[var(--text-muted)] leading-snug mt-0.5 line-clamp-2">{item.desc}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tera Type */}
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {t('calc_tera_type', 'Tera Type')}
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={state.teraType ?? ''}
                onChange={e => onChange({ ...state, teraType: e.target.value || null })}
                className="flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 cursor-pointer"
              >
                <option value="">{t('calc_no_tera', 'None')}</option>
                {TERA_TYPES.map(type => {
                  const translated = translateType(type, lang);
                  return <option key={type} value={type}>{translated.charAt(0).toUpperCase() + translated.slice(1)}</option>;
                })}
              </select>
              {state.teraType && (
                <img src={getTypeSpriteUrl(state.teraType)} alt={state.teraType} className="w-12 h-auto object-contain" />
              )}
            </div>
          </div>

          {/* Current HP % (for pinch abilities like Blaze) */}
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {t('calc_current_hp', 'Current HP')}
              <span className="ml-1 font-black text-[var(--text-primary)] tabular-nums">{state.currentHPPercent}%</span>
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={state.currentHPPercent}
              onChange={e => onChange({ ...state, currentHPPercent: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer ev-slider"
              style={{
                '--slider-color': state.currentHPPercent > 50 ? '#10B981' : state.currentHPPercent > 25 ? '#F59E0B' : '#EF4444',
                background: `linear-gradient(to right, ${state.currentHPPercent > 50 ? '#10B981' : state.currentHPPercent > 25 ? '#F59E0B' : '#EF4444'} ${state.currentHPPercent}%, var(--color-border) ${state.currentHPPercent}%)`,
              } as React.CSSProperties}
            />
          </div>

          {/* Stats — compact EV/IV */}
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_3rem_3rem] gap-x-1 items-center px-1.5 py-1 bg-[var(--color-card-alt)] text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              <span></span><span>{t('calc_stat_header', 'Stat')}</span><span className="text-center">EV</span><span className="text-center">IV</span>
            </div>
            {STAT_ORDER.map(stat => {
              const isBoosted = natureMods[stat] === 1.1;
              const isDropped = natureMods[stat] === 0.9;
              const calcVal = calcStats?.[stat] ?? 0;
              const barPct = Math.min(100, (calcVal / 500) * 100);
              return (
                <div key={stat} className="grid grid-cols-[auto_1fr_3rem_3rem] gap-x-1 items-center px-1.5 py-1 border-t border-[var(--color-border)]/30">
                  <span className={`text-[10px] font-extrabold w-8 ${isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : STAT_TEXT[stat]}`} style={{ fontFamily: 'var(--font-display)' }}>
                    {STAT_DISPLAY[stat]}{isBoosted ? '↑' : isDropped ? '↓' : ''}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-[var(--color-card)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${STAT_COLORS[stat]}`} style={{ width: `${barPct}%` }} />
                    </div>
                    <span className="text-[10px] font-black tabular-nums w-6 text-right text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {calcVal}
                    </span>
                  </div>
                  <input
                    type="number" min={0} max={252}
                    value={state.evs[stat]}
                    onChange={e => {
                      const v = Math.max(0, Math.min(252, Number(e.target.value) || 0));
                      onChange({ ...state, evs: { ...state.evs, [stat]: v } });
                    }}
                    className="w-full px-1 py-0.5 text-[10px] font-bold rounded bg-[var(--color-card-alt)] border border-[var(--color-border)]/50 text-[var(--text-primary)] text-center tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/40"
                    style={{ fontFamily: 'var(--font-display)' }}
                  />
                  <input
                    type="number" min={0} max={31}
                    value={state.ivs[stat]}
                    onChange={e => {
                      const v = Math.max(0, Math.min(31, Number(e.target.value) || 0));
                      onChange({ ...state, ivs: { ...state.ivs, [stat]: v } });
                    }}
                    className="w-full px-1 py-0.5 text-[10px] font-bold rounded bg-[var(--color-card-alt)] border border-[var(--color-border)]/50 text-[var(--text-primary)] text-center tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/40"
                    style={{ fontFamily: 'var(--font-display)' }}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Empty state */}
      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
          <svg viewBox="0 0 200 200" className="w-16 h-16 opacity-20 mb-2" aria-hidden="true">
            <circle cx="100" cy="100" r="93" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="7" y1="100" x2="193" y2="100" stroke="currentColor" strokeWidth="4" />
            <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          <p className="text-xs font-semibold">{t('calc_pick_pokemon', 'Pick a Pokémon')}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" role="status" aria-label="Loading" />
        </div>
      )}
    </div>
  );
};

export default PokemonPanel;
