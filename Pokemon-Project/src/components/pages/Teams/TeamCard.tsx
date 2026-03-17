import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeams } from '../../../context/TeamsContext';
import TeamSlot from './TeamSlot';
import PokemonPickerModal from './PokemonPickerModal';
import type { Team, EVSpread, IVSpread } from '../../../lib/teams';

interface Props {
  team: Team;
}

const TeamCard: React.FC<Props> = ({ team }) => {
  const { t } = useTranslation();
  const {
    deleteTeam, renameTeam, removeMember,
    updateMemberMoves, updateMemberAbility,
    updateMemberItem, updateMemberNature, updateMemberEVs, updateMemberIVs,
  } = useTeams();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(team.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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

  // ── Showdown export ───────────────────────────────────────────────────────
  const EXPORT_STAT: Record<string, string> = {
    hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
  };

  const fmtSlug = (slug: string) =>
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const generateShowdownExport = (): string =>
    team.members
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map(m => {
        const lines: string[] = [];
        const name = fmtSlug(m.pokemon_name);
        lines.push(m.item ? `${name} @ ${m.item}` : name);
        if (m.ability) lines.push(`Ability: ${fmtSlug(m.ability)}`);
        if (m.evs) {
          const evParts = (Object.entries(m.evs) as [keyof EVSpread, number][])
            .filter(([, v]) => v > 0)
            .map(([k, v]) => `${v} ${EXPORT_STAT[k]}`);
          if (evParts.length > 0) lines.push(`EVs: ${evParts.join(' / ')}`);
        }
        if (m.ivs) {
          const ivParts = (Object.entries(m.ivs) as [keyof IVSpread, number][])
            .filter(([, v]) => v > 0)
            .map(([k, v]) => `${v} ${EXPORT_STAT[k]}`);
          if (ivParts.length > 0) lines.push(`IVs: ${ivParts.join(' / ')}`);
        }
        if (m.nature) lines.push(`${m.nature} Nature`);
        (m.moves ?? []).forEach(move => lines.push(`- ${fmtSlug(move)}`));
        return lines.join('\n');
      })
      .join('\n\n');

  const handleExport = async () => {
    const text = generateShowdownExport();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build slot map for O(1) lookup
  const slotMap = Object.fromEntries(team.members.map(m => [m.slot, m]));

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-400" />

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
              className="flex-1 px-2 py-1 rounded border border-red-400 dark:border-red-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 text-left font-bold text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 text-sm cursor-pointer"
              title={t('teams_rename_team')}
            >
              {team.name}
            </button>
          )}

          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {team.members.length}/6
          </span>

          {team.members.length > 0 && (
            <button
              onClick={handleExport}
              className={`shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                copied
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              {copied ? t('teams_copied') : t('teams_export_showdown')}
            </button>
          )}

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(slot => (
              <TeamSlot
                key={slot}
                teamId={team.id}
                slot={slot}
                member={slotMap[slot]}
                onAdd={() => setPickerSlot(slot)}
                onRemove={handleRemoveMember}
                onUpdateMoves={(s, moves) => updateMemberMoves(team.id, s, moves)}
                onUpdateAbility={(s, ability) => updateMemberAbility(team.id, s, ability)}
                onUpdateItem={(s, item) => updateMemberItem(team.id, s, item)}
                onUpdateNature={(s, nature) => updateMemberNature(team.id, s, nature)}
                onUpdateEVs={(s, evs) => updateMemberEVs(team.id, s, evs)}
                onUpdateIVs={(s, ivs) => updateMemberIVs(team.id, s, ivs)}
              />
            ))}
          </div>

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
