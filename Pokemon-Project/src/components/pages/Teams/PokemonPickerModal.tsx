import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTeams } from '../../../context/TeamsContext';
import { usePokemonSearch, type PokemonEntry } from '../../../hooks/usePokemonSearch';
import type { TeamMemberInput } from '../../../lib/teams';

interface Props {
  teamId: string;
  slot: number;
  onClose: () => void;
}

function getDisplayName(p: PokemonEntry): string {
  return (p.displayName ?? p.name).replace(/-/g, ' ');
}

const PokemonPickerModal: React.FC<Props> = ({ teamId, slot, onClose }) => {
  const { t } = useTranslation();
  const { addMember } = useTeams();
  const { allPokemon, loading: listLoading } = usePokemonSearch();

  // Include base species + regional/alt forms (exclude mega/gmax — not real team forms)
  const pickablePokemon = React.useMemo(
    () => allPokemon.filter(p => !p.formType || p.formType === 'alola' || p.formType === 'galar' || p.formType === 'hisui' || p.formType === 'paldea' || p.formType === 'alt'),
    [allPokemon]
  );

  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<PokemonEntry[]>([]);
  const [pickingKey, setPickingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(60);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(pickablePokemon);
    } else {
      setFiltered(
        pickablePokemon.filter(p => {
          const display = getDisplayName(p).toLowerCase();
          return display.includes(q) || p.name.toLowerCase().includes(q) || p.id.toString().includes(q);
        })
      );
    }
    setDisplayCount(60);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [search, pickablePokemon]);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setDisplayCount(prev => Math.min(prev + 60, filtered.length));
    }
  }, [filtered.length]);

  const entryKey = (e: PokemonEntry) => e.megaForm ?? e.id.toString();

  const handlePick = async (entry: PokemonEntry) => {
    if (pickingKey !== null) return;
    setPickingKey(entryKey(entry));
    setError(null);
    try {
      // Use form name for alternate forms to get correct types/stats/moves
      const formName = entry.megaForm ?? entry.name;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${formName}`);
      const data: { types: Array<{ type: { name: string } }> } = await res.json();
      const types = data.types.map(t => t.type.name);

      const member: TeamMemberInput = {
        pokemon_id: entry.id,
        pokemon_name: formName,
        pokemon_types: types,
        slot,
      };
      await addMember(teamId, member);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokémon');
      setPickingKey(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-gray-800 dark:text-white">{t('teams_pick_title')}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('teams_pick_search')}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs shrink-0">
            {error}
          </div>
        )}

        {/* List */}
        <div
          ref={listRef}
          className="overflow-y-auto flex-1 p-2"
          onScroll={handleScroll}
        >
          {listLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
              {t('noResults')}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filtered.slice(0, displayCount).map(entry => {
                const key = entryKey(entry);
                return (
                  <button
                    key={key}
                    onClick={() => handlePick(entry)}
                    disabled={pickingKey !== null}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pickingKey === key ? (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.id}.png`}
                        alt={getDisplayName(entry)}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                      />
                    )}
                    <span className="text-[10px] font-medium capitalize text-gray-700 dark:text-gray-200 text-center truncate w-full">
                      {getDisplayName(entry)}
                    </span>
                    {entry.formType && (
                      <span className="text-[8px] font-bold text-white px-1.5 py-0.5 rounded bg-gray-400 dark:bg-gray-500 uppercase">
                        {entry.formType === 'alt' ? 'form' : entry.formType}
                      </span>
                    )}
                    <span className="text-[9px] text-gray-400 dark:text-gray-500">
                      #{entry.id.toString().padStart(4, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PokemonPickerModal;
