import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTypeSpriteUrl } from '../Pokedex/utils';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { usePokemonAbilities } from '../../../hooks/usePokemonAbilities';
import { usePokemonBaseStats } from '../../../hooks/usePokemonBaseStats';
import type { BaseStats } from '../../../hooks/usePokemonBaseStats';
import { useItemList } from '../../../hooks/useItemList';
import TeamMemberEditor from './TeamMemberEditor';
import { NATURES, getNatureModifiers } from '../../../lib/natures';
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

const getTypeIconUrl = (type: string): string =>
  `/icons-types/${type.toLowerCase()}.svg`;

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
  hp:  'text-rose-600 dark:text-rose-400',
  atk: 'text-amber-600 dark:text-amber-400',
  def: 'text-yellow-600 dark:text-yellow-400',
  spa: 'text-blue-600 dark:text-blue-400',
  spd: 'text-emerald-600 dark:text-emerald-400',
  spe: 'text-violet-600 dark:text-violet-400',
};
const STAT_ROW_BG: Record<keyof BaseStats, string> = {
  hp:  'bg-rose-50/50 dark:bg-rose-900/15',
  atk: 'bg-amber-50/50 dark:bg-amber-900/15',
  def: 'bg-yellow-50/50 dark:bg-yellow-900/15',
  spa: 'bg-blue-50/50 dark:bg-blue-900/15',
  spd: 'bg-emerald-50/50 dark:bg-emerald-900/15',
  spe: 'bg-violet-50/50 dark:bg-violet-900/15',
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
  const { t, i18n } = useTranslation();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const lang = i18n.language;

  const { details: moveDetails } = useMoveDetails(member?.moves ?? [], lang);
  const { abilities } = usePokemonAbilities(member?.pokemon_id ?? null, lang);
  const { stats: baseStats } = usePokemonBaseStats(member?.pokemon_id ?? null);
  const { items: allItems } = useItemList(lang);

  const matchedItem = useMemo(() => {
    if (!member?.item) return null;
    const q = member.item!.toLowerCase();
    return allItems.find(i => i.name.toLowerCase() === q || i.slug === q || i.slug === q.replace(/\s+/g, '-')) ?? null;
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

  const natureMods = useMemo(() => getNatureModifiers(member.nature ?? null), [member.nature]);

  return (
    <>
      <div
        className="group/card flex flex-col rounded-2xl cursor-pointer overflow-hidden bg-[var(--color-card)] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[var(--color-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        role="button"
        tabIndex={0}
        aria-label={`${member.pokemon_name} #${member.pokemon_id} — ${t('teams_edit')}`}
        onClick={() => setIsEditorOpen(true)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsEditorOpen(true); } }}
      >
        {/* ── Header — full type-colored background ───────────── */}
        <div
          className="relative flex flex-col items-center pt-5 pb-4 px-3"
          style={{ background: `linear-gradient(160deg, ${accentHex}35 0%, ${accentHex}15 50%, ${accentHex}08 100%)` }}
        >
          {/* Pokeball watermark */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="w-40 h-40 opacity-[0.06]">
              <circle cx="100" cy="100" r="93" stroke={accentHex} strokeWidth="4" fill="none" />
              <line x1="7" y1="100" x2="193" y2="100" stroke={accentHex} strokeWidth="4" />
              <circle cx="100" cy="100" r="24" stroke={accentHex} strokeWidth="4" fill="none" />
            </svg>
          </div>

          {/* Remove button */}
          <button
            onClick={e => { e.stopPropagation(); onRemove(slot); }}
            aria-label={t('teams_remove_member')}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/70 dark:bg-gray-900/70 text-red-400 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Sprite */}
          <div className="relative z-[1] w-24 h-24 mb-2">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.pokemon_id}.png`}
              alt={member.pokemon_name}
              className="w-24 h-24 object-contain drop-shadow-lg group-hover/card:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={e => {
                (e.target as HTMLImageElement).src =
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.pokemon_id}.png`;
              }}
            />
          </div>

          {/* Name + ID */}
          <p className="relative z-[1] font-extrabold capitalize text-[var(--text-primary)] text-sm text-center leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {member.pokemon_name.replace(/-/g, ' ')}
          </p>
          <span className="relative z-[1] text-[10px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: accentHex }}>
            #{member.pokemon_id.toString().padStart(4, '0')}
          </span>

          {/* Type badges */}
          <div className="relative z-[1] flex flex-wrap justify-center gap-1.5">
            {member.pokemon_types.map(type => (
              <img
                key={type}
                src={getTypeSpriteUrl(type)}
                alt={type}
                title={type}
                className="w-16 h-auto object-contain drop-shadow-md"
              />
            ))}
          </div>
        </div>

        {/* ── Ability & Item — compact row ────────────────────── */}
        {(selectedAbility || matchedItem) && (
          <div className="flex items-stretch border-b border-[var(--color-border)]">
            {selectedAbility && (
              <div className="group/abl relative flex-1 flex items-center gap-1.5 px-2.5 py-2 min-w-0 border-r border-[var(--color-border)] last:border-r-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {selectedAbility.name}
                </span>
                {/* Tooltip */}
                {selectedAbility.shortEffect && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 px-3 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 shadow-xl z-50 opacity-0 pointer-events-none group-hover/abl:opacity-100 group-focus-within/abl:opacity-100 transition-opacity duration-200">
                    <p className="text-[10px] font-bold text-purple-400 mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{selectedAbility.name}</p>
                    <p className="text-[11px] leading-relaxed text-gray-300">{selectedAbility.shortEffect}</p>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                  </div>
                )}
              </div>
            )}
            {matchedItem && (
              <div className="group/itm relative flex-1 flex items-center gap-1.5 px-2.5 py-2 min-w-0">
                <img
                  src={matchedItem.sprite}
                  data-fallback={matchedItem.spriteFallback}
                  alt={matchedItem.name}
                  className="w-4 h-4 shrink-0 object-contain"
                  onError={e => {
                    const img = e.target as HTMLImageElement;
                    const fb = img.dataset.fallback;
                    if (fb && img.src !== fb) img.src = fb;
                  }}
                />
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {matchedItem.name}
                </span>
                {matchedItem.desc && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 px-3 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 shadow-xl z-50 opacity-0 pointer-events-none group-hover/itm:opacity-100 group-focus-within/itm:opacity-100 transition-opacity duration-200">
                    <p className="text-[10px] font-bold text-amber-400 mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{matchedItem.name}</p>
                    <p className="text-[11px] leading-relaxed text-gray-300">{matchedItem.desc}</p>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Stat bars ─────────────────────────────────────── */}
        <div className="px-2.5 py-2">
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            {baseStats ? (
              <>
                {STAT_ORDER.map((stat, i) => {
                  const ev = (member.evs?.[stat]) ?? 0;
                  const iv = (member.ivs?.[stat]) ?? 0;
                  const calc = calcStat(baseStats[stat], ev, iv, stat === 'hp', natureMods[stat]);
                  const barPct = Math.min(100, (calc / STAT_BAR_MAX) * 100);
                  const isBoosted = natureMods[stat] === 1.1;
                  const isDropped = natureMods[stat] === 0.9;
                  return (
                    <div
                      key={stat}
                      className={`flex items-center gap-1.5 px-2.5 py-[5px] ${STAT_ROW_BG[stat]} ${
                        i < STAT_ORDER.length - 1 ? 'border-b border-[var(--color-border)]/30' : ''
                      }`}
                    >
                      <span className={`text-[10px] font-extrabold w-7 shrink-0 ${
                        isBoosted ? 'text-green-600 dark:text-green-400' : isDropped ? 'text-red-500 dark:text-red-400' : STAT_TEXT_COLORS[stat]
                      }`} style={{ fontFamily: 'var(--font-display)' }}>
                        {STAT_DISPLAY[stat]}{isBoosted ? '↑' : isDropped ? '↓' : ''}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                            isBoosted
                              ? 'bg-gradient-to-r from-green-400 to-green-500'
                              : isDropped
                                ? 'bg-gradient-to-r from-red-300 to-red-400'
                                : STAT_BAR_COLORS[stat]
                          }`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <span className={`text-[11px] font-black tabular-nums w-7 text-right shrink-0 ${
                        isBoosted ? 'text-green-600 dark:text-green-400' : isDropped ? 'text-red-500 dark:text-red-400' : STAT_TEXT_COLORS[stat]
                      }`} style={{ fontFamily: 'var(--font-display)' }}>
                        {calc}
                      </span>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex justify-center py-4" role="status" aria-label="Loading stats">
                <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-600 border-t-red-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* ── Moves — colored left border ─────────────────────── */}
        {moves.length > 0 && (
          <div className="px-2.5 pb-2.5 mt-auto">
            <div className="rounded-lg overflow-hidden border border-[var(--color-border)]/60">
              {moves.map((move, i) => {
                const detail = moveDetails[move];
                const typeHex = detail ? (TYPE_ACCENT[detail.type] ?? '#A8A878') : '#A8A878';
                return (
                  <div
                    key={`${move}-${i}`}
                    className={`group/mv relative flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 border-l-[3px] ${
                      i < moves.length - 1 ? 'border-b border-b-[var(--color-border)]/30' : ''
                    }`}
                    style={{
                      borderLeftColor: typeHex,
                      background: `linear-gradient(90deg, ${typeHex}10, transparent)`,
                    }}
                  >
                    {detail && (
                      <img src={getTypeIconUrl(detail.type)} alt={detail.type} className="shrink-0 w-4 h-4 object-contain" />
                    )}
                    <span className="text-[11px] font-bold truncate text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {detail?.name ?? formatMoveName(move)}
                    </span>
                    {detail?.shortEffect && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 px-3 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 shadow-xl z-50 opacity-0 pointer-events-none group-hover/mv:opacity-100 group-focus-within/mv:opacity-100 transition-opacity duration-200">
                        <div className="flex items-center gap-1.5 mb-1">
                          <img src={getTypeIconUrl(detail.type)} alt={detail.type} className="w-3.5 h-3.5 object-contain" />
                          <p className="text-[10px] font-bold text-gray-200" style={{ fontFamily: 'var(--font-display)' }}>{detail.name}</p>
                          {detail.power && <span className="text-[10px] font-bold text-gray-400 ml-auto">{detail.power} pw</span>}
                        </div>
                        <p className="text-[11px] leading-relaxed text-gray-300">{detail.shortEffect}</p>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Edit button ──────────────────────────────────────── */}
        <div className="px-2.5 pb-2.5 mt-auto">
          <button
            onClick={e => { e.stopPropagation(); setIsEditorOpen(true); }}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-bold text-[var(--text-muted)] hover:text-white bg-[var(--color-card-alt)] hover:bg-[var(--color-primary)] transition-all cursor-pointer"
            style={{ fontFamily: 'var(--font-display)' }}
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
