import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getTypeSpriteUrl } from '../Pokedex/utils';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { usePokemonAbilities } from '../../../hooks/usePokemonAbilities';
import { usePokemonBaseStats } from '../../../hooks/usePokemonBaseStats';
import type { BaseStats } from '../../../hooks/usePokemonBaseStats';
import MovePickerModal from './MovePickerModal';
import { useItemList } from '../../../hooks/useItemList';
import type { TeamMember, EVSpread, IVSpread } from '../../../lib/teams';

/* ─── Constants ──────────────────────────────────────────────────────── */

const TYPE_ACCENT: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

const NATURES = [
  ['Hardy', null, null], ['Lonely', 'atk', 'def'],
  ['Brave', 'atk', 'spe'], ['Adamant', 'atk', 'spa'],
  ['Naughty', 'atk', 'spd'], ['Bold', 'def', 'atk'],
  ['Docile', null, null], ['Relaxed', 'def', 'spe'],
  ['Impish', 'def', 'spa'], ['Lax', 'def', 'spd'],
  ['Timid', 'spe', 'atk'], ['Hasty', 'spe', 'def'],
  ['Serious', null, null], ['Jolly', 'spe', 'spa'],
  ['Naive', 'spe', 'spd'], ['Modest', 'spa', 'atk'],
  ['Mild', 'spa', 'def'], ['Quiet', 'spa', 'spe'],
  ['Bashful', null, null], ['Rash', 'spa', 'spd'],
  ['Calm', 'spd', 'atk'], ['Gentle', 'spd', 'def'],
  ['Sassy', 'spd', 'spe'], ['Careful', 'spd', 'spa'],
  ['Quirky', null, null],
] as const;

const STAT_ORDER: (keyof BaseStats)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_DISPLAY: Record<keyof BaseStats, string> = {
  hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
};
const STAT_LABELS: Record<string, string> = {
  atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
};
const EV_TOTAL_MAX = 510;

const NATURE_NAMES_ES: Record<string, string> = {
  Hardy: 'Fuerte', Lonely: 'Huraña', Brave: 'Audaz', Adamant: 'Firme',
  Naughty: 'Pícara', Bold: 'Osada', Docile: 'Dócil', Relaxed: 'Plácida',
  Impish: 'Agitada', Lax: 'Floja', Timid: 'Miedosa', Hasty: 'Activa',
  Serious: 'Seria', Jolly: 'Alegre', Naive: 'Ingenua', Modest: 'Modesta',
  Mild: 'Afable', Quiet: 'Mansa', Bashful: 'Tímida', Rash: 'Alocada',
  Calm: 'Serena', Gentle: 'Amable', Sassy: 'Grosera', Careful: 'Cauta',
  Quirky: 'Rara',
};

const STAT_BAR_COLORS: Record<keyof BaseStats, string> = {
  hp: 'bg-gradient-to-r from-rose-500 to-red-500',
  atk: 'bg-gradient-to-r from-amber-500 to-orange-500',
  def: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  spa: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  spd: 'bg-gradient-to-r from-emerald-500 to-green-500',
  spe: 'bg-gradient-to-r from-violet-500 to-purple-500',
};

function calcStat(base: number, ev: number, iv: number, isHP: boolean, natureMod: number): number {
  const level = 50, evC = Math.floor(ev / 4);
  if (isHP) return Math.floor((2 * base + iv + evC) * level / 100) + level + 10;
  return Math.floor((Math.floor((2 * base + iv + evC) * level / 100) + 5) * natureMod);
}

function formatMoveName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ─── Move category sprites ─────────────────────────────────────────── */

const DAMAGE_CLASS_SPRITE: Record<string, string> = {
  physical: '/move-types/Physic.png',
  special:  '/move-types/Special.png',
  status:   '/move-types/Status.png',
};

/* ─── Type icon SVGs ────────────────────────────────────────────────── */

const getTypeIconUrl = (type: string): string =>
  `/icons-types/${type.toLowerCase()}.svg`;

/* ─── Props ──────────────────────────────────────────────────────────── */

interface Props {
  member: TeamMember;
  slot: number;
  onClose: () => void;
  onRemove: (slot: number) => void;
  onUpdateMoves: (slot: number, moves: string[]) => void;
  onUpdateAbility: (slot: number, ability: string | null) => void;
  onUpdateItem: (slot: number, item: string | null) => void;
  onUpdateNature: (slot: number, nature: string | null) => void;
  onUpdateEVs: (slot: number, evs: EVSpread | null) => void;
  onUpdateIVs: (slot: number, ivs: IVSpread | null) => void;
}

/* ═══════════════════════════════════════════════════════════════════════
   TeamMemberEditor — full-screen modal for editing a team member
   ═══════════════════════════════════════════════════════════════════════ */

const TeamMemberEditor: React.FC<Props> = ({
  member, slot, onClose, onRemove,
  onUpdateMoves, onUpdateAbility, onUpdateItem,
  onUpdateNature, onUpdateEVs, onUpdateIVs,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  /* ── Refs ──────────────────────────────────────────────────────────── */
  const modalRef = useRef<HTMLDivElement>(null);

  /* ── Local state ────────────────────────────────────────────────────── */
  const [pickerMoveIndex, setPickerMoveIndex] = useState<number | null>(null);
  const [itemInput, setItemInput] = useState(member.item ?? '');
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [evsLocal, setEvsLocal] = useState<EVSpread>(
    member.evs ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  );
  const [ivsLocal, setIvsLocal] = useState<IVSpread>(
    member.ivs ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  );

  /* ── Data hooks ─────────────────────────────────────────────────────── */
  const { details: moveDetails } = useMoveDetails(member.moves ?? [], lang);
  const { abilities, loading: abilitiesLoading } = usePokemonAbilities(member.pokemon_id, lang);
  const { stats: baseStats } = usePokemonBaseStats(member.pokemon_id);
  const { items: allItems } = useItemList(lang);

  // Sync item input with localized name when items load
  useEffect(() => {
    if (!member.item || allItems.length === 0) return;
    const q = member.item.toLowerCase();
    const match = allItems.find(i => i.name.toLowerCase() === q || i.slug === q || i.slug === q.replace(/\s+/g, '-'));
    if (match && match.name !== itemInput) setItemInput(match.name);
  }, [allItems]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Derived ────────────────────────────────────────────────────────── */
  const moves = member.moves ?? [];
  const primaryType = member.pokemon_types[0] ?? 'normal';
  const accentHex = TYPE_ACCENT[primaryType] ?? '#A8A878';
  const evTotal = Object.values(evsLocal).reduce((s, v) => s + v, 0);

  const natureMods = { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } as Record<keyof BaseStats, number>;
  if (member.nature) {
    const nat = NATURES.find(([n]) => n === member.nature);
    if (nat?.[1]) {
      natureMods[nat[1] as keyof BaseStats] = 1.1;
      natureMods[nat[2] as keyof BaseStats] = 0.9;
    }
  }

  const filteredItems = useMemo(() => {
    const q = itemInput.toLowerCase().trim();
    if (!q) return allItems;
    return allItems
      .filter(item => item.name.toLowerCase().includes(q) || item.slug.includes(q));
  }, [itemInput, allItems]);

  // Find matched item for showing sprite next to input
  const matchedItem = useMemo(() => {
    if (!itemInput.trim()) return null;
    const q = itemInput.toLowerCase().trim();
    return allItems.find(i => i.name.toLowerCase() === q || i.slug === q || i.slug === q.replace(/\s+/g, '-')) ?? null;
  }, [itemInput, allItems]);

  /* ── Handlers ───────────────────────────────────────────────────────── */
  const handleMoveSelect = (moveSlug: string) => {
    if (pickerMoveIndex === null) return;
    const newMoves = [...moves];
    newMoves[pickerMoveIndex] = moveSlug;
    onUpdateMoves(slot, newMoves);
    setPickerMoveIndex(null);
  };
  const handleMoveRemove = (idx: number) => onUpdateMoves(slot, moves.filter((_, i) => i !== idx));

  const handleItemBlur = () => onUpdateItem(slot, itemInput.trim() || null);

  const handleEVChange = (stat: keyof EVSpread, raw: string) => {
    const val = Math.min(252, Math.max(0, parseInt(raw, 10) || 0));
    setEvsLocal(prev => {
      const currentTotal = Object.values(prev).reduce((s, v) => s + v, 0);
      const remaining = EV_TOTAL_MAX - currentTotal + prev[stat];
      return { ...prev, [stat]: Math.min(val, remaining) };
    });
  };
  const handleEVBlur = () => onUpdateEVs(slot, evTotal > 0 ? evsLocal : null);

  const handleIVChange = (stat: keyof IVSpread, raw: string) => {
    const val = Math.min(31, Math.max(0, parseInt(raw, 10) || 0));
    setIvsLocal(prev => ({ ...prev, [stat]: val }));
  };
  const handleIVBlur = () => {
    const allZero = Object.values(ivsLocal).every(v => v === 0);
    onUpdateIVs(slot, allZero ? null : ivsLocal);
  };

  /* ── Close helper — flush pending EV/IV edits before closing ────────── */
  const handleClose = () => {
    const evTot = Object.values(evsLocal).reduce((s, v) => s + v, 0);
    onUpdateEVs(slot, evTot > 0 ? evsLocal : null);
    const allZeroIV = Object.values(ivsLocal).every(v => v === 0);
    onUpdateIVs(slot, allZeroIV ? null : ivsLocal);
    onClose();
  };

  /* ── Escape key + focus trap ───────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pickerMoveIndex === null) { handleClose(); return; }
      if (e.key === 'Tab' && modalRef.current && pickerMoveIndex === null) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    modalRef.current?.focus();
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose, pickerMoveIndex]);

  /* ── Prevent body scroll ────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

          {/* ═══ Modal container ═══ */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-editor-title"
            tabIndex={-1}
            className="relative z-10 w-full max-w-7xl my-4 mx-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden focus:outline-none"
          >

            {/* ═══════════ HEADER ═══════════════════════════════════════ */}
            <div
              className="relative px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                background: `linear-gradient(135deg, ${accentHex}30 0%, ${accentHex}08 60%, transparent 100%)`,
                borderBottom: `1px solid ${accentHex}20`,
              }}
            >
              {/* Sprite */}
              <div className="relative shrink-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: `${accentHex}18` }}
                >
                  <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40" style={{ backgroundColor: accentHex }} />
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.pokemon_id}.png`}
                    alt={member.pokemon_name}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
                    loading="lazy"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.pokemon_id}.png`;
                    }}
                  />
                </div>
              </div>

              {/* Name + Types */}
              <div className="flex-1 min-w-0">
                <h2 id="team-editor-title" className="text-xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
                  {member.pokemon_name.replace(/-/g, ' ')}
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                  #{member.pokemon_id.toString().padStart(3, '0')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.pokemon_types.map(type => (
                    <img
                      key={type}
                      src={getTypeSpriteUrl(type)}
                      alt={type}
                      title={type}
                      className="w-20 h-20 object-contain drop-shadow-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => { onRemove(slot); handleClose(); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                >
                  {t('teams_remove_member')}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
                >
                  {t('teams_done', 'Done')}
                </button>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ═══════════ BODY ═════════════════════════════════════════ */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">

                {/* ─── LEFT COLUMN : Item + Nature ─────────────────────── */}
                <div className="space-y-5">

                  {/* ▸ Item ───────────────────────────────────────────── */}
                  <section>
                    <SectionTitle accent={accentHex}>{t('teams_item')}</SectionTitle>
                    <div className="relative">
                      <div className="relative flex items-center">
                        {matchedItem && (
                          <img
                            src={matchedItem.sprite}
                            alt={matchedItem.name}
                            className="absolute left-2 w-6 h-6 object-contain pointer-events-none z-10"
                            onError={e => {
                              const img = e.target as HTMLImageElement;
                              if (matchedItem.spriteFallback && img.src !== matchedItem.spriteFallback) {
                                img.src = matchedItem.spriteFallback;
                              } else {
                                img.style.display = 'none';
                              }
                            }}
                          />
                        )}
                        <input
                          type="text"
                          value={itemInput}
                          onChange={e => { setItemInput(e.target.value); setItemDropdownOpen(true); }}
                          onFocus={() => setItemDropdownOpen(true)}
                          onBlur={() => { setTimeout(() => { setItemDropdownOpen(false); handleItemBlur(); }, 150); }}
                          placeholder={t('teams_choose_item')}
                          aria-label={t('teams_item')}
                          className={`w-full py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 dark:focus:border-red-600 transition-all ${matchedItem ? 'pl-9 pr-3' : 'px-3'}`}
                        />
                      </div>
                      {itemInput && (
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setItemInput(''); onUpdateItem(slot, null); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {itemDropdownOpen && filteredItems.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                          {filteredItems.map(item => (
                            <button
                              key={item.slug}
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => { setItemInput(item.name); onUpdateItem(slot, item.name); setItemDropdownOpen(false); }}
                              className="w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                              <img
                                src={item.sprite}
                                data-fallback={item.spriteFallback}
                                alt={item.name}
                                className="w-8 h-8 object-contain shrink-0 mt-0.5"
                                loading="lazy"
                                onError={e => {
                                  const img = e.target as HTMLImageElement;
                                  const fallback = img.dataset.fallback;
                                  if (fallback && img.src !== fallback) {
                                    img.src = fallback;
                                  } else {
                                    img.style.display = 'none';
                                    img.nextElementSibling?.classList.remove('hidden');
                                  }
                                }}
                              />
                              <span className="hidden w-8 h-8 shrink-0 mt-0.5 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/></svg>
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{item.name}</p>
                                {item.desc && (
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5 line-clamp-2">{item.desc}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* ▸ Nature ────────────────────────────────────────── */}
                  <section>
                    <SectionTitle accent={accentHex}>{t('teams_nature')}</SectionTitle>
                    <select
                      value={member.nature ?? ''}
                      onChange={e => onUpdateNature(slot, e.target.value || null)}
                      aria-label={t('teams_nature')}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 dark:focus:border-red-600 transition-all cursor-pointer"
                    >
                      <option value="">{t('teams_choose_nature')}</option>
                      {NATURES.map(([name, up, down]) => {
                        const displayName = lang === 'es' ? (NATURE_NAMES_ES[name as string] ?? name as string) : name as string;
                        return (
                          <option key={name as string} value={name as string}>
                            {displayName}{up ? ` (+${STAT_LABELS[up as string]} / -${STAT_LABELS[down as string]})` : ` (${t('teams_neutral', 'Neutral')})`}
                          </option>
                        );
                      })}
                    </select>
                  </section>
                </div>

                {/* ─── RIGHT COLUMN : Unified Stats + Ability + Moves ── */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

                  {/* ▸ Stats table ─────────────────────────────────────── */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" aria-label="Stats">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-16">Stat</th>
                          <th className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-14">Base</th>
                          <th className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">EV</th>
                          <th className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-14">IV</th>
                          <th className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-14">Lv.50</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {STAT_ORDER.map(stat => {
                          const isBoosted = natureMods[stat] === 1.1;
                          const isDropped = natureMods[stat] === 0.9;
                          const barPct = Math.min(100, (evsLocal[stat] / 252) * 100);
                          const calc = baseStats ? calcStat(baseStats[stat], evsLocal[stat], ivsLocal[stat], stat === 'hp', natureMods[stat]) : null;
                          return (
                            <tr
                              key={stat}
                              className={
                                isBoosted ? 'bg-green-50/50 dark:bg-green-900/10' :
                                isDropped ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                              }
                            >
                              <td className="px-3 py-2">
                                <span className={`text-xs font-extrabold ${
                                  isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {STAT_DISPLAY[stat]}
                                  {isBoosted && <span className="text-[8px] ml-0.5">{'\u2191'}</span>}
                                  {isDropped && <span className="text-[8px] ml-0.5">{'\u2193'}</span>}
                                </span>
                              </td>
                              <td className="text-center px-2 py-2">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums">
                                  {baseStats ? baseStats[stat] : '\u2014'}
                                </span>
                              </td>
                              <td className="px-2 py-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min={0}
                                    max={252}
                                    step={4}
                                    value={evsLocal[stat]}
                                    onChange={e => handleEVChange(stat, e.target.value)}
                                    onMouseUp={handleEVBlur}
                                    onTouchEnd={handleEVBlur}
                                    aria-label={`EV ${STAT_DISPLAY[stat]}`}
                                    className="ev-slider flex-1 h-2 cursor-pointer"
                                    style={{
                                      '--slider-color': isBoosted ? '#22c55e' : isDropped ? '#f87171' : undefined,
                                    } as React.CSSProperties}
                                  />
                                  <span className={`text-xs font-bold tabular-nums w-8 text-right shrink-0 ${
                                    isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : 'text-gray-600 dark:text-gray-300'
                                  }`}>
                                    {evsLocal[stat]}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center px-2 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  max={31}
                                  value={ivsLocal[stat]}
                                  onChange={e => handleIVChange(stat, e.target.value)}
                                  onBlur={handleIVBlur}
                                  aria-label={`IV ${STAT_DISPLAY[stat]}`}
                                  className="w-12 px-1 py-0.5 text-xs text-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-red-400 dark:focus:border-red-600 transition-colors tabular-nums font-bold"
                                />
                              </td>
                              <td className="text-center px-2 py-2">
                                <span className={`text-sm font-black tabular-nums ${
                                  isBoosted ? 'text-green-600 dark:text-green-400'
                                  : isDropped ? 'text-red-500 dark:text-red-400'
                                  : 'text-gray-800 dark:text-gray-100'
                                }`}>
                                  {calc ?? '\u2014'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                          <td className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</td>
                          <td className="text-center px-2 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums">
                            {baseStats ? STAT_ORDER.reduce((s, k) => s + baseStats[k], 0) : '\u2014'}
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center justify-end">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                evTotal >= EV_TOTAL_MAX
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                              }`}>
                                {evTotal}/{EV_TOTAL_MAX}
                              </span>
                            </div>
                          </td>
                          <td />
                          <td className="text-center px-2 py-2 text-sm font-black tabular-nums text-gray-800 dark:text-gray-100">
                            {baseStats
                              ? STAT_ORDER.reduce((sum, s) => sum + calcStat(baseStats[s], evsLocal[s], ivsLocal[s], s === 'hp', natureMods[s]), 0)
                              : '\u2014'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* ▸ Ability ─────────────────────────────────────────── */}
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{t('teams_ability')}</p>
                    {abilitiesLoading ? (
                      <div className="flex items-center gap-2 py-1" role="status" aria-label={t('teams_loading_abilities')}>
                        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-red-500 rounded-full animate-spin" />
                        <span className="text-sm text-gray-400 dark:text-gray-500">{t('teams_loading_abilities')}</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {abilities.map(ability => {
                          const isSelected = member.ability === ability.slug;
                          return (
                            <div key={ability.slug} className="relative group/abl">
                              <button
                                onClick={() => onUpdateAbility(slot, ability.slug)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                              >
                                {ability.name}
                                {ability.isHidden && (
                                  <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                  }`}>
                                    {t('teams_hidden_ability')}
                                  </span>
                                )}
                              </button>
                              {ability.shortEffect && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 px-3 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 shadow-xl z-50 opacity-0 invisible group-hover/abl:opacity-100 group-hover/abl:visible group-focus-within/abl:opacity-100 group-focus-within/abl:visible transition-all duration-200 pointer-events-none">
                                  <p className="text-[10px] font-bold text-purple-400 mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{ability.name}</p>
                                  <p className="text-[11px] leading-relaxed text-gray-300">{ability.shortEffect}</p>
                                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ▸ Moves ───────────────────────────────────────────── */}
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{t('teams_moves')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {moves.map((slug, idx) => {
                        const detail = moveDetails[slug];
                        const catSprite = detail ? DAMAGE_CLASS_SPRITE[detail.damageClass] : null;
                        return (
                          <div
                            key={idx}
                            className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            {detail ? (
                              <img src={getTypeIconUrl(detail.type)} alt={detail.type} title={detail.type} className="shrink-0 w-5 h-5 object-contain drop-shadow" />
                            ) : (
                              <span className="shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            )}
                            <button
                              onClick={() => setPickerMoveIndex(idx)}
                              className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer truncate"
                            >
                              {detail?.name ?? formatMoveName(slug)}
                            </button>
                            {detail && (
                              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums w-7 text-right shrink-0">
                                {detail.power ?? '\u2014'}
                              </span>
                            )}
                            {catSprite && (
                              <img src={catSprite} alt={detail!.damageClass} title={detail!.damageClass} className="shrink-0 w-14 h-auto object-contain" />
                            )}
                            <button
                              onClick={() => handleMoveRemove(idx)}
                              aria-label={`${t('teams_remove_member', 'Remove')} ${detail?.name ?? formatMoveName(slug)}`}
                              className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                      {/* Empty move slots */}
                      {moves.length < 4 && Array.from({ length: 4 - moves.length }).map((_, i) => (
                        <button
                          key={`empty-${i}`}
                          onClick={() => setPickerMoveIndex(moves.length + i)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{t('teams_add_move')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Move picker — uses its own portal (z-[70]) so it layers above */}
      {pickerMoveIndex !== null && (
        <MovePickerModal
          pokemonId={member.pokemon_id}
          currentMoves={moves}
          onSelect={handleMoveSelect}
          onClose={() => setPickerMoveIndex(null)}
        />
      )}
    </>
  );
};

/* ─── Tiny helper for consistent section headings ───────────────────── */

const SectionTitle: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => (
  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
    {children}
  </h3>
);

export default TeamMemberEditor;
