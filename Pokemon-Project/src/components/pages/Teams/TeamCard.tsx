import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeams } from '../../../context/TeamsContext';
import TeamSlot from './TeamSlot';
import TypeCoveragePanel from './TypeCoveragePanel';
import PokemonPickerModal from './PokemonPickerModal';
import type { Team } from '../../../lib/teams';

interface Props {
  team: Team;
}

const TeamCard: React.FC<Props> = ({ team }) => {
  const { t } = useTranslation();
  const { deleteTeam, renameTeam, removeMember, updateMemberMoves, updateMemberAbility } = useTeams();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(team.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const handleRename = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== team.name) {
      renameTeam(team.id, trimmed);
    } else {
      setNameValue(team.name);
    }
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteTeam(team.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleRemoveMember = (slot: number) => {
    removeMember(team.id, slot);
  };

  // Build slot map for O(1) lookup
  const slotMap = Object.fromEntries(team.members.map(m => [m.slot, m]));

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-green-500 to-teal-500" />

        {/* Team header */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
          {editing ? (
            <input
              type="text"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setNameValue(team.name);
                  setEditing(false);
                }
              }}
              className="flex-1 px-2 py-1 rounded border border-green-400 dark:border-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 text-left font-bold text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-sm cursor-pointer"
              title={t('teams_rename_team')}
            >
              {team.name}
            </button>
          )}

          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {team.members.length}/6
          </span>

          <button
            onClick={handleDelete}
            className={`shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              confirmDelete
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
            }`}
          >
            {confirmDelete ? t('teams_confirm_delete') : t('teams_delete_team')}
          </button>
        </div>

        {/* Slots grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(slot => (
              <TeamSlot
                key={slot}
                slot={slot}
                member={slotMap[slot]}
                onAdd={() => setPickerSlot(slot)}
                onRemove={handleRemoveMember}
                onUpdateMoves={(s, moves) => updateMemberMoves(team.id, s, moves)}
                onUpdateAbility={(s, ability) => updateMemberAbility(team.id, s, ability)}
              />
            ))}
          </div>

          {/* Type coverage — only shown when team has at least one member */}
          {team.members.length > 0 && (
            <TypeCoveragePanel members={team.members} />
          )}
        </div>
      </div>

      {/* Picker modal — rendered via portal */}
      {pickerSlot !== null && (
        <PokemonPickerModal
          teamId={team.id}
          slot={pickerSlot}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </>
  );
};

export default TeamCard;
