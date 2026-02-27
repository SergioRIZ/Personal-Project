import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useCollection } from '../../../context/CollectionContext';
import { useTeams } from '../../../context/TeamsContext';
import type { TeamMemberInput } from '../../../lib/teams';

interface Props {
  teamId: string;
  slot: number;
  onClose: () => void;
}

const PokemonPickerModal: React.FC<Props> = ({ teamId, slot, onClose }) => {
  const { t } = useTranslation();
  const { collectionItems } = useCollection();
  const { addMember } = useTeams();

  const [search, setSearch] = useState('');
  const [pickingId, setPickingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return collectionItems;
    return collectionItems.filter(
      item =>
        item.pokemon_name.toLowerCase().includes(q) ||
        item.pokemon_id.toString().includes(q)
    );
  }, [collectionItems, search]);

  const handlePick = async (item: { pokemon_id: number; pokemon_name: string }) => {
    if (pickingId !== null) return;
    setPickingId(item.pokemon_id);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.pokemon_id}`);
      const data: { types: Array<{ type: { name: string } }> } = await res.json();
      const types = data.types.map(t => t.type.name);

      const member: TeamMemberInput = {
        pokemon_id: item.pokemon_id,
        pokemon_name: item.pokemon_name,
        pokemon_types: types,
        slot,
      };
      await addMember(teamId, member);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokémon');
      setPickingId(null);
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
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <div className="overflow-y-auto flex-1 p-2">
          {collectionItems.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
              {t('teams_not_in_collection')}
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
              {t('noResults')}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filtered.map(item => (
                <button
                  key={item.pokemon_id}
                  onClick={() => handlePick(item)}
                  disabled={pickingId !== null}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pickingId === item.pokemon_id ? (
                    <div className="w-10 h-10 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemon_id}.png`}
                      alt={item.pokemon_name}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                    />
                  )}
                  <span className="text-[10px] font-medium capitalize text-gray-700 dark:text-gray-200 text-center truncate w-full">
                    {item.pokemon_name.replace('-', ' ')}
                  </span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500">
                    #{item.pokemon_id.toString().padStart(4, '0')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PokemonPickerModal;
