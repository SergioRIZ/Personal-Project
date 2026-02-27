import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTypeColor, translateType } from '../Pokedex/utils';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import MovePickerModal from './MovePickerModal';
import type { TeamMember } from '../../../lib/teams';

interface Props {
  slot: number;
  member?: TeamMember;
  onAdd: () => void;
  onRemove: (slot: number) => void;
  onUpdateMoves: (slot: number, moves: string[]) => void;
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

// Category icons
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

function formatMoveName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const TeamSlot: React.FC<Props> = ({ slot, member, onAdd, onRemove, onUpdateMoves }) => {
  const { t, i18n } = useTranslation();
  const [pickerMoveIndex, setPickerMoveIndex] = useState<number | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const { details: moveDetails } = useMoveDetails(member?.moves ?? []);

  // ── Empty slot ────────────────────────────────────────────────────────────
  if (!member) {
    return (
      <button
        onClick={onAdd}
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 hover:border-green-400 dark:hover:border-green-600 hover:text-green-400 dark:hover:text-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-200 cursor-pointer w-full min-h-[280px] group"
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

  const hoveredDetail = hoveredSlug ? moveDetails[hoveredSlug] : null;

  return (
    <>
      <div
        className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        style={{ borderTopColor: accentHex, borderTopWidth: '3px' }}
      >
        {/* ── Header: sprite + name + types ── */}
        <div
          className="relative flex flex-col items-center pt-4 pb-3 px-3 group/card"
          style={{ background: `linear-gradient(160deg, ${accentHex}22 0%, transparent 65%)` }}
        >
          {/* Remove Pokémon button */}
          <button
            onClick={() => onRemove(slot)}
            aria-label={t('teams_remove_member')}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-red-400 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer border border-gray-200 dark:border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Sprite with type-tinted circle */}
          <div className="relative w-20 h-20 mb-1">
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: `${accentHex}25` }}
            />
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.pokemon_id}.png`}
              alt={member.pokemon_name}
              className="relative w-20 h-20 object-contain drop-shadow-md"
              loading="lazy"
              onError={e => {
                // Fallback to regular sprite if official artwork fails
                (e.target as HTMLImageElement).src =
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.pokemon_id}.png`;
              }}
            />
          </div>

          {/* Name */}
          <p className="font-bold capitalize text-gray-800 dark:text-white text-sm text-center leading-tight">
            {member.pokemon_name.replace(/-/g, ' ')}
          </p>
          {/* ID */}
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
            #{member.pokemon_id.toString().padStart(3, '0')}
          </p>

          {/* Type badges */}
          <div className="flex flex-wrap justify-center gap-1">
            {member.pokemon_types.map(type => (
              <span
                key={type}
                className={`px-2 py-0.5 rounded-full text-white text-[10px] font-semibold tracking-wide ${getTypeColor(type)}`}
              >
                {translateType(type, i18n.language)}
              </span>
            ))}
          </div>
        </div>

        {/* ── Moves section ── */}
        <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2 flex-1">
          {/* Section header */}
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: accentHex }}
            />
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              {t('teams_moves')}
            </p>
          </div>

          <div className="space-y-0.5">
            {/* Filled move rows */}
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
                    {/* Type pill */}
                    {detail ? (
                      <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-white text-[9px] font-semibold ${getTypeColor(detail.type)}`}>
                        {translateType(detail.type, i18n.language)}
                      </span>
                    ) : (
                      <span className="shrink-0 w-10 h-4 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
                    )}

                    {/* Name — click to replace */}
                    <button
                      onClick={() => setPickerMoveIndex(idx)}
                      className="flex-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer truncate"
                    >
                      {formatMoveName(slug)}
                    </button>

                    {/* Power */}
                    {detail ? (
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0 w-6 text-right">
                        {detail.power ?? '—'}
                      </span>
                    ) : (
                      <span className="w-5 h-3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse shrink-0" />
                    )}

                    {/* Category icon */}
                    {cat && (
                      <span className={`shrink-0 ${cat.color}`}>{cat.icon}</span>
                    )}

                    {/* Remove move */}
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

            {/* Empty move slots */}
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

          {/* Description panel — shown when hovering a move */}
          <div
            className="mt-2 overflow-hidden transition-all duration-200"
            style={{ maxHeight: hoveredDetail?.shortEffect ? '60px' : '0px' }}
          >
            {hoveredDetail?.shortEffect && (
              <div
                className="px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: `${accentHex}15` }}
              >
                <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  {hoveredDetail.shortEffect}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Move picker modal */}
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
