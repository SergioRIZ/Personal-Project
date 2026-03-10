import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTypeSpriteUrl } from '../Pokedex/utils';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { usePokemonAbilities } from '../../../hooks/usePokemonAbilities';
import { usePokemonBaseStats } from '../../../hooks/usePokemonBaseStats';
import type { BaseStats } from '../../../hooks/usePokemonBaseStats';
import { useItemList } from '../../../hooks/useItemList';
import TeamMemberEditor from './TeamMemberEditor';
import type { TeamMember, EVSpread, IVSpread } from '../../../lib/teams';

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
  onUpdateIVs: (slot: number, ivs: IVSpread | null) => void;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

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

const DAMAGE_CLASS_SPRITE: Record<string, string> = {
  physical: '/move-types/Physic.png',
  special:  '/move-types/Special.png',
  status:   '/move-types/Status.png',
};

const getTypeIconUrl = (type: string): string =>
  `/icons-types/${type.toLowerCase()}.svg`;

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
const STAT_BAR_MAX = 400;

function calcStat(base: number, ev: number, iv: number, isHP: boolean, natureMod: number): number {
  const level = 50, evC = Math.floor(ev / 4);
  if (isHP) return Math.floor((2 * base + iv + evC) * level / 100) + level + 10;
  return Math.floor((Math.floor((2 * base + iv + evC) * level / 100) + 5) * natureMod);
}

function formatMoveName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ═══════════════════════════════════════════════════════════════════════
   TeamSlot — compact card (stats view) + editor modal
   ═══════════════════════════════════════════════════════════════════════ */

const TeamSlot: React.FC<Props> = ({
  slot, member, onAdd, onRemove, onUpdateMoves, onUpdateAbility,
  onUpdateItem, onUpdateNature, onUpdateEVs, onUpdateIVs,
}) => {
  const { t } = useTranslation();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { details: moveDetails } = useMoveDetails(member?.moves ?? []);
  const { abilities } = usePokemonAbilities(member?.pokemon_id ?? null);
  const { stats: baseStats } = usePokemonBaseStats(member?.pokemon_id ?? null);
  const { items: allItems } = useItemList();

  const matchedItem = useMemo(() => {
    if (!member?.item) return null;
    return allItems.find(i => i.name.toLowerCase() === member.item!.toLowerCase()) ?? null;
  }, [member?.item, allItems]);

  /* ── Empty slot ──────────────────────────────────────────────────── */
  if (!member) {
    return (
      <button
        onClick={onAdd}
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 hover:border-red-400 dark:hover:border-red-600 hover:text-red-400 dark:hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all duration-200 cursor-pointer w-full min-h-[200px] sm:min-h-[280px] group"
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

  /* ── Filled slot — derived data ──────────────────────────────────── */
  const primaryType = member.pokemon_types[0] ?? 'normal';
  const accentHex = TYPE_ACCENT[primaryType] ?? '#A8A878';
  const moves = member.moves ?? [];
  const selectedAbility = abilities.find(a => a.slug === member.ability) ?? null;

  const natureMods = { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } as Record<keyof BaseStats, number>;
  if (member.nature) {
    const nat = NATURES.find(([n]) => n === member.nature);
    if (nat?.[1]) {
      natureMods[nat[1] as keyof BaseStats] = 1.1;
      natureMods[nat[2] as keyof BaseStats] = 0.9;
    }
  }

  return (
    <>
      <div
        className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
        style={{ borderTopColor: accentHex, borderTopWidth: '3px' }}
        onClick={() => setIsEditorOpen(true)}
      >
        {/* ── Card header ─────────────────────────────────────────── */}
        <div
          className="relative flex flex-col items-center pt-4 pb-3 px-3 group/card"
          style={{ background: `linear-gradient(160deg, ${accentHex}22 0%, transparent 65%)` }}
        >
          {/* Remove button */}
          <button
            onClick={e => { e.stopPropagation(); onRemove(slot); }}
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
          <div className="flex flex-wrap justify-center gap-10">
            {member.pokemon_types.map(type => (
              <img
                key={type}
                src={getTypeSpriteUrl(type)}
                alt={type}
                title={type}
                className="w-20 h-20 object-contain drop-shadow-lg hover:scale-110 transition-transform duration-200"
              />
            ))}
          </div>
        </div>

        {/* ── Stat bars ───────────────────────────────────────────── */}
        <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Lv.50
            </span>
            {member.nature && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {member.nature}
              </span>
            )}
          </div>

          {baseStats ? (
            <div className="space-y-1.5">
              {STAT_ORDER.map(stat => {
                const ev = (member.evs?.[stat]) ?? 0;
                const iv = (member.ivs?.[stat]) ?? 0;
                const calc = calcStat(baseStats[stat], ev, iv, stat === 'hp', natureMods[stat]);
                const barPct = Math.min(100, (calc / STAT_BAR_MAX) * 100);
                const isBoosted = natureMods[stat] === 1.1;
                const isDropped = natureMods[stat] === 0.9;
                return (
                  <div key={stat} className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold w-7 shrink-0 ${
                      isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {STAT_DISPLAY[stat]}
                    </span>
                    <div className="flex-1 h-2.5 rounded-md bg-gray-100 dark:bg-gray-700/80 overflow-hidden">
                      <div
                        className={`h-full rounded-md transition-all duration-700 ease-out ${
                          isBoosted
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : isDropped
                              ? 'bg-gradient-to-r from-red-300 to-red-400'
                              : STAT_BAR_COLORS[stat]
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold tabular-nums w-8 text-right shrink-0 ${
                      isBoosted ? 'text-green-500' : isDropped ? 'text-red-400' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {calc}
                    </span>
                  </div>
                );
              })}
              {/* Total */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700/50">
                <span className="text-[10px] font-extrabold w-7 shrink-0 text-gray-400 dark:text-gray-500">
                  Tot
                </span>
                <span className="flex-1" />
                <span className="text-[11px] font-bold tabular-nums w-8 text-right shrink-0 text-gray-700 dark:text-gray-200">
                  {STAT_ORDER.reduce((sum, s) => {
                    const ev = (member.evs?.[s]) ?? 0;
                    const iv = (member.ivs?.[s]) ?? 0;
                    return sum + calcStat(baseStats[s], ev, iv, s === 'hp', natureMods[s]);
                  }, 0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-600 border-t-red-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* ── Summary table (ability, item, moves) ──────────────── */}
        <div className="border-t border-gray-100 dark:border-gray-700 flex-1">
          <table className="w-full text-[10px]">
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {/* Ability row */}
              {selectedAbility && (
                <tr className="group/ability">
                  <td className="px-2 py-1 text-gray-400 dark:text-gray-500 font-bold uppercase w-0 whitespace-nowrap">Abl</td>
                  <td className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium cursor-help" title={selectedAbility.shortEffect} colSpan={2}>
                    {selectedAbility.name}
                  </td>
                </tr>
              )}
              {/* Item row */}
              {matchedItem && (
                <tr>
                  <td className="px-2 py-1 text-gray-400 dark:text-gray-500 font-bold uppercase w-0 whitespace-nowrap">Item</td>
                  <td className="px-2 py-1" colSpan={2}>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={matchedItem.sprite}
                        data-fallback={matchedItem.spriteFallback}
                        alt={matchedItem.name}
                        title={matchedItem.desc}
                        className="w-5 h-5 object-contain shrink-0"
                        onError={e => {
                          const img = e.target as HTMLImageElement;
                          const fb = img.dataset.fallback;
                          if (fb && img.src !== fb) img.src = fb;
                        }}
                      />
                      <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{matchedItem.name}</span>
                    </div>
                  </td>
                </tr>
              )}
              {/* Moves — 2 columns × 2 rows */}
              {moves.length > 0 && (
                <tr>
                  <td className="px-2 py-1 text-gray-400 dark:text-gray-500 font-bold uppercase w-0 whitespace-nowrap align-top">Mvs</td>
                  <td className="px-1 py-1" colSpan={2}>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      {moves.map((move, i) => {
                        const detail = moveDetails[move];
                        return (
                          <div key={i} className="flex items-center gap-1 min-w-0">
                            {detail && (
                              <img src={getTypeIconUrl(detail.type)} alt={detail.type} className="shrink-0 w-3 h-3 object-contain" />
                            )}
                            <span className="text-gray-600 dark:text-gray-300 truncate">{formatMoveName(move)}</span>
                            {detail && DAMAGE_CLASS_SPRITE[detail.damageClass] && (
                              <img src={DAMAGE_CLASS_SPRITE[detail.damageClass]} alt={detail.damageClass} className="shrink-0 w-7 h-auto object-contain" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Edit button ──────────────────────────────────────────── */}
        <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2">
          <button
            onClick={e => { e.stopPropagation(); setIsEditorOpen(true); }}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer border border-dashed border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {t('teams_edit')}
          </button>
        </div>
      </div>

      {/* ── Editor modal (portal) ──────────────────────────────────── */}
      {isEditorOpen && member && (
        <TeamMemberEditor
          member={member}
          slot={slot}
          onClose={() => setIsEditorOpen(false)}
          onRemove={onRemove}
          onUpdateMoves={onUpdateMoves}
          onUpdateAbility={onUpdateAbility}
          onUpdateItem={onUpdateItem}
          onUpdateNature={onUpdateNature}
          onUpdateEVs={onUpdateEVs}
          onUpdateIVs={onUpdateIVs}
        />
      )}
    </>
  );
};

export default TeamSlot;
