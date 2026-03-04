import React, { useState, useEffect } from 'react';
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

/* ─── Popular competitive items ──────────────────────────────────────── */

const POPULAR_ITEMS = [
  { name: 'Leftovers', desc: 'Restores 1/16 max HP every turn' },
  { name: 'Life Orb', desc: '1.3\u00d7 damage, costs 1/10 max HP' },
  { name: 'Choice Band', desc: '1.5\u00d7 Attack, locks into one move' },
  { name: 'Choice Specs', desc: '1.5\u00d7 Sp. Atk, locks into one move' },
  { name: 'Choice Scarf', desc: '1.5\u00d7 Speed, locks into one move' },
  { name: 'Focus Sash', desc: 'Survives a KO at 1 HP when at full HP' },
  { name: 'Assault Vest', desc: '1.5\u00d7 Sp. Def, attacks only' },
  { name: 'Heavy-Duty Boots', desc: 'Immune to entry hazards' },
  { name: 'Rocky Helmet', desc: 'Contact moves deal 1/6 HP to attacker' },
  { name: 'Eviolite', desc: '1.5\u00d7 Def & SpD if not fully evolved' },
  { name: 'Air Balloon', desc: 'Ground immunity until hit' },
  { name: 'Expert Belt', desc: 'Super effective moves deal 1.2\u00d7' },
  { name: 'Sitrus Berry', desc: 'Restores 1/4 HP when HP \u2264 50%' },
  { name: 'Lum Berry', desc: 'Cures any status condition once' },
  { name: 'Weakness Policy', desc: '+2 Atk & SpA on super effective hit' },
  { name: 'Booster Energy', desc: 'Activates Protosynthesis / Quark Drive' },
];

/* ─── Move category mini-icons ───────────────────────────────────────── */

const PhysicalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.707 3.293a1 1 0 00-1.414 0l-8 8a1 1 0 000 1.414l8 8a1 1 0 001.414 0l8-8a1 1 0 000-1.414l-8-8z"/>
  </svg>
);
const SpecialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const StatusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

const DAMAGE_CLASS_STYLES: Record<string, { icon: React.ReactNode; color: string }> = {
  physical: { icon: <PhysicalIcon />, color: 'text-orange-500 dark:text-orange-400' },
  special:  { icon: <SpecialIcon />,  color: 'text-blue-500 dark:text-blue-400' },
  status:   { icon: <StatusIcon />,   color: 'text-gray-400 dark:text-gray-500' },
};

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
  const { t } = useTranslation();

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
  const { details: moveDetails } = useMoveDetails(member.moves ?? []);
  const { abilities, loading: abilitiesLoading } = usePokemonAbilities(member.pokemon_id);
  const { stats: baseStats } = usePokemonBaseStats(member.pokemon_id);
  const { items: allItems } = useItemList();

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

  const filteredItems = (() => {
    const q = itemInput.toLowerCase().trim();
    if (!q) return [];
    return allItems
      .filter(item => item.name.toLowerCase().includes(q) || item.slug.includes(q))
      .slice(0, 8);
  })();

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
  const handleSelectPopularItem = (name: string) => {
    setItemInput(name);
    onUpdateItem(slot, name);
  };

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

  /* ── Escape key ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pickerMoveIndex === null) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, pickerMoveIndex]);

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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* ═══ Modal container ═══ */}
          <div className="relative z-10 w-full max-w-5xl my-4 mx-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">

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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
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
                  onClick={() => { onRemove(slot); onClose(); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                >
                  {t('teams_remove_member')}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-sm"
                >
                  Done
                </button>
                <button
                  onClick={onClose}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* ─── COLUMN 1 : Details ──────────────────────────────── */}
                <div className="space-y-5">

                  {/* ▸ Item ───────────────────────────────────────────── */}
                  <section>
                    <SectionTitle accent={accentHex}>{t('teams_item')}</SectionTitle>

                    {/* Search input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={itemInput}
                        onChange={e => { setItemInput(e.target.value); setItemDropdownOpen(true); }}
                        onFocus={() => { if (itemInput.trim()) setItemDropdownOpen(true); }}
                        onBlur={() => { setTimeout(() => { setItemDropdownOpen(false); handleItemBlur(); }, 150); }}
                        placeholder={t('teams_choose_item')}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 dark:focus:border-green-600 transition-all"
                      />
                      {itemInput && (
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setItemInput(''); onUpdateItem(slot, null); setItemDropdownOpen(false); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {/* Autocomplete dropdown */}
                      {itemDropdownOpen && filteredItems.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                          {filteredItems.map(item => (
                            <button
                              key={item.slug}
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => { setItemInput(item.name); onUpdateItem(slot, item.name); setItemDropdownOpen(false); }}
                              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Popular items list */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                        Popular Items
                      </p>
                      <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800/80">
                        {POPULAR_ITEMS.map(item => {
                          const isSelected = itemInput.toLowerCase() === item.name.toLowerCase();
                          return (
                            <button
                              key={item.name}
                              onClick={() => handleSelectPopularItem(item.name)}
                              className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-green-50 dark:bg-green-900/20'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                              }`}
                            >
                              {/* radio dot */}
                              <span className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                isSelected
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <div className="min-w-0">
                                <p className={`text-xs font-semibold leading-tight ${
                                  isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  {/* ▸ Ability ────────────────────────────────────────── */}
                  <section>
                    <SectionTitle accent={accentHex}>{t('teams_ability')}</SectionTitle>
                    {abilitiesLoading ? (
                      <div className="flex items-center gap-2 py-3">
                        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-green-500 rounded-full animate-spin" />
                        <span className="text-xs text-gray-400 dark:text-gray-500">{t('teams_loading_abilities')}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {abilities.map(ability => {
                          const isSelected = member.ability === ability.slug;
                          return (
                            <button
                              key={ability.slug}
                              onClick={() => onUpdateAbility(slot, ability.slug)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-green-50 dark:bg-green-900/20 ring-1 ring-green-200 dark:ring-green-800'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  {isSelected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </span>
                                <span className={`text-sm font-semibold ${
                                  isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                  {ability.name}
                                </span>
                                {ability.isHidden && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 uppercase">
                                    {t('teams_hidden_ability')}
                                  </span>
                                )}
                              </div>
                              {ability.shortEffect && (
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 pl-[1.625rem] leading-relaxed line-clamp-2">
                                  {ability.shortEffect}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* ▸ Nature ────────────────────────────────────────── */}
                  <section>
                    <SectionTitle accent={accentHex}>{t('teams_nature')}</SectionTitle>
                    <select
                      value={member.nature ?? ''}
                      onChange={e => onUpdateNature(slot, e.target.value || null)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 dark:focus:border-green-600 transition-all cursor-pointer"
                    >
                      <option value="">{t('teams_choose_nature')}</option>
                      {NATURES.map(([name]) => (
                        <option key={name as string} value={name as string}>{name as string}</option>
                      ))}
                    </select>
                    {(() => {
                      if (!member.nature) return null;
                      const nat = NATURES.find(([n]) => n === member.nature);
                      if (!nat || !nat[1]) return null;
                      return (
                        <div className="flex items-center gap-3 mt-2 px-1">
                          <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            {STAT_LABELS[nat[1] as string]}
                          </span>
                          <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {STAT_LABELS[nat[2] as string]}
                          </span>
                        </div>
                      );
                    })()}
                  </section>
                </div>

                {/* ─── COLUMN 2 : Moves ────────────────────────────────── */}
                <div>
                  <SectionTitle accent={accentHex}>{t('teams_moves')}</SectionTitle>

                  <div className="space-y-1.5">
                    {moves.map((slug, idx) => {
                      const detail = moveDetails[slug];
                      const cat = detail ? DAMAGE_CLASS_STYLES[detail.damageClass] : null;
                      return (
                        <div
                          key={idx}
                          className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {detail ? (
                            <img
                              src={getTypeSpriteUrl(detail.type)}
                              alt={detail.type}
                              title={detail.type}
                              className="shrink-0 w-7 h-7 object-contain drop-shadow-lg"
                            />
                          ) : (
                            <span className="shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                          )}

                          <button
                            onClick={() => setPickerMoveIndex(idx)}
                            className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer truncate"
                          >
                            {formatMoveName(slug)}
                          </button>

                          {detail && (
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums w-8 text-right shrink-0">
                              {detail.power ?? '\u2014'}
                            </span>
                          )}

                          {cat && <span className={`shrink-0 ${cat.color}`}>{cat.icon}</span>}

                          <button
                            onClick={() => handleMoveRemove(idx)}
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
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{t('teams_add_move')}</span>
                      </button>
                    ))}
                  </div>

                  {/* Move info (if any detail loaded) */}
                  {moves.length > 0 && (() => {
                    const loadedMoves = moves.filter(m => moveDetails[m]?.shortEffect);
                    if (loadedMoves.length === 0) return null;
                    return (
                      <div className="mt-4 space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          Move Details
                        </p>
                        {loadedMoves.map(slug => {
                          const d = moveDetails[slug];
                          if (!d) return null;
                          return (
                            <div key={slug} className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/40">
                              <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">{formatMoveName(slug)}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed mt-0.5">{d.shortEffect}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* ─── COLUMN 3 : Stats ────────────────────────────────── */}
                <div className="md:col-span-2 lg:col-span-1 space-y-5">

                  {/* ▸ EVs ─────────────────────────────────────────────── */}
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <SectionTitle accent={accentHex}>{t('teams_evs')}</SectionTitle>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        evTotal >= EV_TOTAL_MAX
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {EV_TOTAL_MAX - evTotal} {t('teams_ev_remaining')}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {STAT_ORDER.map(stat => {
                        const isBoosted = natureMods[stat] === 1.1;
                        const isDropped = natureMods[stat] === 0.9;
                        const barPct = Math.min(100, (evsLocal[stat] / 252) * 100);
                        return (
                          <div key={stat} className="flex items-center gap-2">
                            <span className={`text-[11px] font-extrabold w-9 shrink-0 ${
                              isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {STAT_DISPLAY[stat]}
                              {isBoosted && <span className="text-[8px] ml-0.5">\u2191</span>}
                              {isDropped && <span className="text-[8px] ml-0.5">\u2193</span>}
                            </span>
                            <div className="flex-1 h-3.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ease-out ${
                                  isBoosted
                                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                                    : isDropped
                                      ? 'bg-gradient-to-r from-red-300 to-red-400'
                                      : STAT_BAR_COLORS[stat]
                                }`}
                                style={{ width: `${barPct}%` }}
                              />
                            </div>
                            <input
                              type="number"
                              min={0}
                              max={252}
                              value={evsLocal[stat]}
                              onChange={e => handleEVChange(stat, e.target.value)}
                              onBlur={handleEVBlur}
                              className="w-14 px-1.5 py-1 text-xs text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-green-400 dark:focus:border-green-600 transition-colors tabular-nums font-semibold"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* ▸ IVs ─────────────────────────────────────────────── */}
                  <section>
                    <SectionTitle accent={accentHex}>{t('teams_ivs')}</SectionTitle>
                    <div className="grid grid-cols-6 gap-2">
                      {STAT_ORDER.map(stat => (
                        <div key={stat} className="flex flex-col items-center gap-1">
                          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                            {STAT_DISPLAY[stat]}
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={31}
                            value={ivsLocal[stat]}
                            onChange={e => handleIVChange(stat, e.target.value)}
                            onBlur={handleIVBlur}
                            className="w-full px-1 py-1.5 text-sm text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-green-400 dark:focus:border-green-600 transition-colors tabular-nums font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ▸ Calculated Stats ─────────────────────────────────── */}
                  {baseStats && (
                    <section>
                      <SectionTitle accent={accentHex}>Lv.50 Stats</SectionTitle>
                      <div className="grid grid-cols-3 gap-2">
                        {STAT_ORDER.map(stat => {
                          const calc = calcStat(baseStats[stat], evsLocal[stat], ivsLocal[stat], stat === 'hp', natureMods[stat]);
                          const isBoosted = natureMods[stat] === 1.1;
                          const isDropped = natureMods[stat] === 0.9;
                          return (
                            <div
                              key={stat}
                              className={`text-center px-2 py-2 rounded-xl transition-colors ${
                                isBoosted
                                  ? 'bg-green-50 dark:bg-green-900/15'
                                  : isDropped
                                    ? 'bg-red-50 dark:bg-red-900/15'
                                    : 'bg-gray-50 dark:bg-gray-800/60'
                              }`}
                            >
                              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                                {STAT_DISPLAY[stat]}
                              </p>
                              <p className={`text-lg font-black tabular-nums leading-tight ${
                                isBoosted ? 'text-green-600 dark:text-green-400'
                                : isDropped ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-800 dark:text-gray-100'
                              }`}>
                                {calc}
                              </p>
                              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                                Base {baseStats[stat]}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      {/* Total row */}
                      <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</span>
                        <span className="text-lg font-black tabular-nums text-gray-800 dark:text-gray-100">
                          {STAT_ORDER.reduce(
                            (sum, s) => sum + calcStat(baseStats[s], evsLocal[s], ivsLocal[s], s === 'hp', natureMods[s]),
                            0,
                          )}
                        </span>
                      </div>
                    </section>
                  )}
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
