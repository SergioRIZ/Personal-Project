import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeams } from '../../../context/TeamsContext';
import { navigate } from '../../../navigation';
import type { Team, EVSpread, IVSpread } from '../../../lib/teams';

interface Props {
  team: Team;
}

const TeamSummaryCard: React.FC<Props> = ({ team }) => {
  const { t } = useTranslation();
  const { deleteTeam, renameTeam } = useTeams();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(team.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRename = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== team.name) renameTeam(team.id, trimmed);
    else setNameValue(team.name);
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

  const slotMap = Object.fromEntries(team.members.map(m => [m.slot, m]));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-green-500 to-teal-500" />

      {/* Header: name + count + export + delete */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
        {editing ? (
          <input
            type="text"
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') { setNameValue(team.name); setEditing(false); }
            }}
            className="flex-1 px-2 py-1 rounded border border-green-400 dark:border-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title={t('teams_rename_team')}
            className="flex-1 text-left font-bold text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-sm cursor-pointer"
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
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
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

      {/* Body: mini sprites + Edit button */}
      <div className="px-4 py-4 flex items-center gap-4">
        {/* 6 mini sprite slots */}
        <div className="flex gap-2 flex-1 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map(slot => {
            const member = slotMap[slot];
            return member ? (
              <div
                key={slot}
                title={member.pokemon_name.replace(/-/g, ' ')}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.pokemon_id}.png`}
                  alt={member.pokemon_name}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                key={slot}
                className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0"
                aria-label={`Empty slot ${slot}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 dark:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            );
          })}
        </div>

        {/* Edit Team button */}
        <button
          onClick={() => navigate(`/teamsbuilder/${team.id}`)}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {t('teams_edit', 'Edit Team')}
        </button>
      </div>
    </div>
  );
};

export default TeamSummaryCard;
