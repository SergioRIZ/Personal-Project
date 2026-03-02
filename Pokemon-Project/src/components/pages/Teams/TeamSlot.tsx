import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTypeColor, translateType } from '../Pokedex/utils';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { usePokemonAbilities } from '../../../hooks/usePokemonAbilities';
import { usePokemonBaseStats } from '../../../hooks/usePokemonBaseStats';
import type { BaseStats } from '../../../hooks/usePokemonBaseStats';
import MovePickerModal from './MovePickerModal';
import type { TeamMember, EVSpread } from '../../../lib/teams';

interface Props {
  slot: number;
  member?: TeamMember;
  onAdd: () => void;
  onRemove: (slot: number) => void;
  onUpdateMoves: (slot: number, moves: string[]) => void;
  onUpdateAbility: (slot: number, ability: string | null) => void;
  onUpdateItem: (slot: number, item: string | null) => void;
  onUpdateNature: (slot: number, nature: string | null) => void;
  onUpdateEVs: (slot: number, evs: EVSpread | null) => void;
}

// Classic Pokémon type accent colors for card theming
const TYPE_ACCENT: Record<string, string> = {
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  electric: '#F8D030',
  grass:    '#78C850',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};

// Move category icons
const PhysicalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.707 3.293a1 1 0 00-1.414 0l-8 8a1 1 0 000 1.414l8 8a1 1 0 001.414 0l8-8a1 1 0 000-1.414l-8-8z"/>
  </svg>
);
const SpecialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const StatusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

const DAMAGE_CLASS_STYLES = {
  physical: { icon: <PhysicalIcon />, color: 'text-orange-500 dark:text-orange-400' },
  special:  { icon: <SpecialIcon />,  color: 'text-blue-500 dark:text-blue-400'    },
  status:   { icon: <StatusIcon />,   color: 'text-gray-400 dark:text-gray-500'    },
};

const NATURES = [
  ['Hardy',   null,  null  ], ['Lonely',  'atk', 'def'],
  ['Brave',   'atk', 'spe'], ['Adamant', 'atk', 'spa'],
  ['Naughty', 'atk', 'spd'], ['Bold',    'def', 'atk'],
  ['Docile',  null,  null  ], ['Relaxed', 'def', 'spe'],
  ['Impish',  'def', 'spa'], ['Lax',     'def', 'spd'],
  ['Timid',   'spe', 'atk'], ['Hasty',   'spe', 'def'],
  ['Serious', null,  null  ], ['Jolly',   'spe', 'spa'],
  ['Naive',   'spe', 'spd'], ['Modest',  'spa', 'atk'],
  ['Mild',    'spa', 'def'], ['Quiet',   'spa', 'spe'],
  ['Bashful', null,  null  ], ['Rash',    'spa', 'spd'],
  ['Calm',    'spd', 'atk'], ['Gentle',  'spd', 'def'],
  ['Sassy',   'spd', 'spe'], ['Careful', 'spd', 'spa'],
  ['Quirky',  null,  null  ],
] as const;

const STAT_LABELS: Record<string, string> = {
  atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
};

const EV_TOTAL_MAX = 510;

// Stats view constants
const STAT_ORDER: (keyof BaseStats)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_DISPLAY: Record<keyof BaseStats, string> = {
  hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
};
const STAT_BAR_COLORS: Record<keyof BaseStats, string> = {
  hp:  'bg-gradient-to-r from-rose-500 to-red-500',
  atk: 'bg-gradient-to-r from-amber-500 to-orange-500',
  def: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  spa: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  spd: 'bg-gradient-to-r from-emerald-500 to-green-500',
  spe: 'bg-gradient-to-r from-violet-500 to-purple-500',
};
const STAT_TEXT_COLORS: Record<keyof BaseStats, string> = {
  hp:  'text-rose-500',
  atk: 'text-amber-500',
  def: 'text-yellow-500',
  spa: 'text-blue-500',
  spd: 'text-emerald-500',
  spe: 'text-violet-500',
};
const STAT_BAR_MAX = 400;

// Lv 50, IVs = 31 (competitive defaults)
function calcStat(base: number, ev: number, isHP: boolean, natureMod: number): number {
  const level = 50, iv = 31, evC = Math.floor(ev / 4);
  if (isHP) return Math.floor((2 * base + iv + evC) * level / 100) + level + 10;
  return Math.floor((Math.floor((2 * base + iv + evC) * level / 100) + 5) * natureMod);
}

function formatMoveName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const TeamSlot: React.FC<Props> = ({
  slot, member, onAdd, onRemove, onUpdateMoves, onUpdateAbility,
  onUpdateItem, onUpdateNature, onUpdateEVs,
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'stats' | 'edit'>('stats');
  const [pickerMoveIndex, setPickerMoveIndex] = useState<number | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [abilityPickerOpen, setAbilityPickerOpen] = useState(false);
  const [competitiveOpen, setCompetitiveOpen] = useState(false);
  const [itemInput, setItemInput] = useState(member?.item ?? '');
  const [evsLocal, setEvsLocal] = useState<EVSpread>(
    member?.evs ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  );

  // Sync local state + reset view when a different Pokémon loads into this slot
  useEffect(() => {
    setItemInput(member?.item ?? '');
    setEvsLocal(member?.evs ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
    setViewMode('stats');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.pokemon_id]);

  const { details: moveDetails } = useMoveDetails(member?.moves ?? []);
  const { abilities, loading: abilitiesLoading } = usePokemonAbilities(member?.pokemon_id ?? null);
  const { stats: baseStats } = usePokemonBaseStats(member?.pokemon_id ?? null);

  // ── Empty slot ────────────────────────────────────────────────────────────
  if (!member) {
    return (
      <button
        onClick={onAdd}
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 hover:border-green-400 dark:hover:border-green-600 hover:text-green-400 dark:hover:text-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-200 cursor-pointer w-full min-h-[200px] sm:min-h-[280px] group"
        title={t('teams_add_pokemon')}
      >
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-xs font-semibold tracking-wide uppercase opacity-60">{t('teams_empty_slot')} {slot}</span>
      </button>
    );
  }

  // ── Filled slot ───────────────────────────────────────────────────────────
  const primaryType = member.pokemon_types[0] ?? 'normal';
  const accentHex = TYPE_ACCENT[primaryType] ?? '#A8A878';
  const moves = member.moves ?? [];
  const selectedAbility = abilities.find(a => a.slug === member.ability) ?? null;

  // Nature modifier lookup
  const natureMods = { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } as Record<keyof BaseStats, number>;
  if (member.nature) {
    const nat = NATURES.find(([n]) => n === member.nature);
    if (nat?.[1]) {
      natureMods[nat[1] as keyof BaseStats] = 1.1;
      natureMods[nat[2] as keyof BaseStats] = 0.9;
    }
  }

  const handleMoveSelect = (moveSlug: string) => {
    if (pickerMoveIndex === null) return;
    const newMoves = [...moves];
    newMoves[pickerMoveIndex] = moveSlug;
    onUpdateMoves(slot, newMoves);
    setPickerMoveIndex(null);
  };

  const handleMoveRemove = (idx: number) => {
    onUpdateMoves(slot, moves.filter((_, i) => i !== idx));
  };

  const handleAbilitySelect = (abilitySlug: string) => {
    onUpdateAbility(slot, abilitySlug);
    setAbilityPickerOpen(false);
  };

  const evTotal = Object.values(evsLocal).reduce((s, v) => s + v, 0);

  const handleItemBlur = () => {
    onUpdateItem(slot, itemInput.trim() || null);
  };

  const handleEVChange = (stat: keyof EVSpread, raw: string) => {
    const val = Math.min(252, Math.max(0, parseInt(raw, 10) || 0));
    setEvsLocal(prev => {
      const currentTotal = Object.values(prev).reduce((s, v) => s + v, 0);
      const remaining = EV_TOTAL_MAX - currentTotal + prev[stat];
      const clamped = Math.min(val, remaining);
      return { ...prev, [stat]: clamped };
    });
  };

  const handleEVBlur = () => {
    onUpdateEVs(slot, evTotal > 0 ? evsLocal : null);
  };

  const hoveredDetail = hoveredSlug ? moveDetails[hoveredSlug] : null;

  // ── Shared card header ────────────────────────────────────────────────────
  const cardHeader = (
    <div
      className="relative flex flex-col items-center pt-4 pb-3 px-3 group/card"
      style={{ background: `linear-gradient(160deg, ${accentHex}22 0%, transparent 65%)` }}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(slot)}
        aria-label={t('teams_remove_member')}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-red-400 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer border border-gray-200 dark:border-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Sprite */}
      <div className="relative w-20 h-20 mb-1">
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: `${accentHex}25` }} />
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.pokemon_id}.png`}
          alt={member.pokemon_name}
          className="relative w-20 h-20 object-contain drop-shadow-md"
          loading="lazy"
          onError={e => {
            (e.target as HTMLImageElement).src =
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.pokemon_id}.png`;
          }}
        />
      </div>

      {/* Name + ID */}
      <p className="font-bold capitalize text-gray-800 dark:text-white text-sm text-center leading-tight">
        {member.pokemon_name.replace(/-/g, ' ')}
      </p>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
        #{member.pokemon_id.toString().padStart(3, '0')}
      </p>

      {/* Type badges */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {member.pokemon_types.map(type => (
          <span
            key={type}
            className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-white text-xs font-bold capitalize shadow-sm border border-white/20 hover:scale-105 transition-all duration-200 ${getTypeColor(type)}`}
          >
            {translateType(type, 'en')}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        style={{ borderTopColor: accentHex, borderTopWidth: '3px' }}
      >
        {cardHeader}

        {viewMode === 'stats' ? (
          /* ══════════════════════════════════════════════════
             STATS VIEW
          ══════════════════════════════════════════════════ */
          <>
            {/* Stat bars */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t('baseStats')}
                </p>
                <span className="text-[9px] text-gray-400 dark:text-gray-500">
                  Lv.50{member.nature ? ` · ${member.nature}` : ''}
                </span>
              </div>

              {baseStats ? (
                <div className="space-y-1">
                  {STAT_ORDER.map(stat => {
                    const ev = (member.evs?.[stat]) ?? 0;
                    const calc = calcStat(baseStats[stat], ev, stat === 'hp', natureMods[stat]);
                    const barPct = Math.min(100, (calc / STAT_BAR_MAX) * 100);
                    const isBoosted = natureMods[stat] === 1.1;
                    const isDropped = natureMods[stat] === 0.9;
                    return (
                      <div key={stat} className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold w-8 shrink-0 ${
                          isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : STAT_TEXT_COLORS[stat]
                        }`}>
                          {STAT_DISPLAY[stat]}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isBoosted
                                ? 'bg-green-500'
                                : isDropped
                                  ? 'bg-red-400'
                                  : STAT_BAR_COLORS[stat]
                            }`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono font-semibold w-7 text-right shrink-0 ${
                          isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {calc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center py-3">
                  <div className="w-4 h-4 border-2 border-gray-200 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Summary: ability + item + moves */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2 flex-1 space-y-2">
              {/* Ability + item chips */}
              {(selectedAbility || member.item) && (
                <div className="flex flex-wrap gap-1">
                  {selectedAbility && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300 font-medium">
                      {selectedAbility.name}
                    </span>
                  )}
                  {member.item && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300 font-medium">
                      @ {member.item}
                    </span>
                  )}
                </div>
              )}

              {/* Move grid */}
              {moves.length > 0 && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  {moves.map((move, i) => {
                    const detail = moveDetails[move];
                    const cat = detail ? DAMAGE_CLASS_STYLES[detail.damageClass] : null;
                    return (
                      <div key={i} className="flex items-center gap-1 min-w-0">
                        {cat && <span className={`shrink-0 ${cat.color}`}>{cat.icon}</span>}
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate">
                          {formatMoveName(move)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Edit button */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2">
              <button
                onClick={() => setViewMode('edit')}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {t('teams_edit')}
              </button>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════════════════════
             EDIT VIEW
          ══════════════════════════════════════════════════ */
          <>
            {/* Back to stats */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 pt-2 pb-0">
              <button
                onClick={() => setViewMode('stats')}
                className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {t('teams_back')}
              </button>
            </div>

            {/* ── Ability section ── */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex-1">
                  {t('teams_ability')}
                </p>
                {!abilityPickerOpen && member.ability && (
                  <button
                    onClick={() => setAbilityPickerOpen(true)}
                    className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer"
                    aria-label="Change ability"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                {abilityPickerOpen && (
                  <button
                    onClick={() => setAbilityPickerOpen(false)}
                    className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {abilityPickerOpen ? (
                abilitiesLoading ? (
                  <div className="flex items-center gap-1.5 py-1 px-1">
                    <div className="w-3 h-3 border border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{t('teams_loading_abilities')}</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {abilities.map(ability => {
                      const isSelected = member.ability === ability.slug;
                      return (
                        <button
                          key={ability.slug}
                          onClick={() => handleAbilitySelect(ability.slug)}
                          className={`w-full text-left px-2 py-1.5 rounded-lg transition-all cursor-pointer group/ab ${
                            isSelected
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`shrink-0 w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300 dark:border-gray-600 group-hover/ab:border-gray-400'
                            }`}>
                              {isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className={`text-[11px] font-semibold flex-1 ${
                              isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-200'
                            }`}>
                              {ability.name}
                            </span>
                            {ability.isHidden && (
                              <span className="shrink-0 px-1 py-px rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                {t('teams_hidden_ability')}
                              </span>
                            )}
                          </div>
                          {ability.shortEffect && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 pl-4 leading-relaxed line-clamp-2">
                              {ability.shortEffect}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                member.ability && selectedAbility ? (
                  <div className="px-1 py-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {selectedAbility.name}
                      </span>
                      {selectedAbility.isHidden && (
                        <span className="px-1 py-px rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                          {t('teams_hidden_ability')}
                        </span>
                      )}
                    </div>
                    {selectedAbility.shortEffect && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed line-clamp-2 italic">
                        {selectedAbility.shortEffect}
                      </p>
                    )}
                  </div>
                ) : abilitiesLoading ? (
                  <div className="flex items-center gap-1.5 px-1 py-1">
                    <div className="w-3 h-3 border border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{t('teams_loading_abilities')}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setAbilityPickerOpen(true)}
                    className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-[11px] text-gray-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-150 cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{t('teams_choose_ability')}</span>
                  </button>
                )
              )}
            </div>

            {/* ── Competitive section ── */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex-1">
                  {t('teams_competitive')}
                </p>
                <button
                  onClick={() => setCompetitiveOpen(o => !o)}
                  className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer"
                  aria-label={competitiveOpen ? 'Close competitive' : 'Edit competitive'}
                >
                  {competitiveOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  )}
                </button>
              </div>

              {competitiveOpen ? (
                <div className="space-y-2">
                  {/* Item */}
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">
                      {t('teams_item')}
                    </label>
                    <input
                      type="text"
                      value={itemInput}
                      onChange={e => setItemInput(e.target.value)}
                      onBlur={handleItemBlur}
                      placeholder={t('teams_choose_item')}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-green-400 dark:focus:border-green-600 transition-colors"
                    />
                  </div>

                  {/* Nature */}
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">
                      {t('teams_nature')}
                    </label>
                    <select
                      value={member.nature ?? ''}
                      onChange={e => onUpdateNature(slot, e.target.value || null)}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-green-400 dark:focus:border-green-600 transition-colors cursor-pointer"
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
                        <p className="text-[10px] mt-0.5 pl-1">
                          <span className="text-green-500">↑ {STAT_LABELS[nat[1] as string]}</span>
                          {' '}
                          <span className="text-red-400">↓ {STAT_LABELS[nat[2] as string]}</span>
                        </p>
                      );
                    })()}
                  </div>

                  {/* EVs */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {t('teams_evs')}
                      </label>
                      <span className={`text-[9px] font-bold ${evTotal >= EV_TOTAL_MAX ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                        {EV_TOTAL_MAX - evTotal} {t('teams_ev_remaining')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {(Object.keys(evsLocal) as (keyof EVSpread)[]).map(stat => (
                        <div key={stat} className="flex flex-col items-center gap-0.5">
                          <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                            {stat === 'hp' ? 'HP' : STAT_LABELS[stat]}
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={252}
                            value={evsLocal[stat]}
                            onChange={e => handleEVChange(stat, e.target.value)}
                            onBlur={handleEVBlur}
                            className="w-full px-1 py-0.5 text-xs text-center rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-green-400 dark:focus:border-green-600 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Collapsed: summary or prompt */
                (() => {
                  const hasData = member.item || member.nature || evTotal > 0;
                  if (!hasData) {
                    return (
                      <button
                        onClick={() => setCompetitiveOpen(true)}
                        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-[11px] text-gray-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-150 cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{t('teams_competitive')}</span>
                      </button>
                    );
                  }
                  const evSummary = (Object.entries(evsLocal) as [keyof EVSpread, number][])
                    .filter(([, v]) => v > 0)
                    .map(([k, v]) => `${v} ${k === 'hp' ? 'HP' : STAT_LABELS[k]}`)
                    .join(' / ');
                  return (
                    <div className="px-1 py-0.5 space-y-0.5">
                      {member.item && <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">{member.item}</p>}
                      {member.nature && <p className="text-[11px] text-gray-500 dark:text-gray-400">{member.nature}</p>}
                      {evSummary && <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{evSummary}</p>}
                    </div>
                  );
                })()
              )}
            </div>

            {/* ── Moves section ── */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2 flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t('teams_moves')}
                </p>
              </div>

              <div className="space-y-0.5">
                {moves.map((slug, idx) => {
                  const detail = moveDetails[slug];
                  const cat = detail ? DAMAGE_CLASS_STYLES[detail.damageClass] : null;
                  return (
                    <div
                      key={idx}
                      className="group/move"
                      onMouseEnter={() => setHoveredSlug(slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                    >
                      <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {detail ? (
                          <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-white text-[9px] font-semibold ${getTypeColor(detail.type)}`}>
                            {translateType(detail.type, 'en')}
                          </span>
                        ) : (
                          <span className="shrink-0 w-10 h-4 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
                        )}

                        <button
                          onClick={() => setPickerMoveIndex(idx)}
                          className="flex-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer truncate"
                        >
                          {formatMoveName(slug)}
                        </button>

                        {detail ? (
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0 w-6 text-right">
                            {detail.power ?? '—'}
                          </span>
                        ) : (
                          <span className="w-5 h-3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse shrink-0" />
                        )}

                        {cat && <span className={`shrink-0 ${cat.color}`}>{cat.icon}</span>}

                        <button
                          onClick={() => handleMoveRemove(idx)}
                          aria-label="Remove move"
                          className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover/move:opacity-100 transition-all cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {moves.length < 4 && Array.from({ length: 4 - moves.length }).map((_, i) => (
                  <button
                    key={`empty-${i}`}
                    onClick={() => setPickerMoveIndex(moves.length + i)}
                    className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-[11px] text-gray-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-150 cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{t('teams_add_move')}</span>
                  </button>
                ))}
              </div>

              {/* Move description on hover */}
              <div
                className="mt-2 overflow-hidden transition-all duration-200"
                style={{ maxHeight: hoveredDetail?.shortEffect ? '60px' : '0px' }}
              >
                {hoveredDetail?.shortEffect && (
                  <div className="px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: `${accentHex}15` }}>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
                      {hoveredDetail.shortEffect}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

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

export default TeamSlot;
