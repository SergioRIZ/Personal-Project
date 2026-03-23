import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTeams } from '../../../context/TeamsContext';
import { navigate } from '../../../navigation';
import { useSpriteResolver } from '../../../hooks/usePokemonSearch';
import type { Team, EVSpread, IVSpread } from '../../../lib/teams';
import { parseShowdownText, resolveShowdownMon } from '../../../lib/showdownParser';

interface Props {
  team: Team;
}

const TeamSummaryCard: React.FC<Props> = ({ team }) => {
  const { t } = useTranslation();
  const { deleteTeam, renameTeam, addMember } = useTeams();
  const resolveSprite = useSpriteResolver();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(team.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

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

  // ── Showdown import ───────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!importText.trim()) return;
    setImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const parsed = parseShowdownText(importText);
      if (parsed.length === 0) {
        setImportError(t('teams_import_no_pokemon'));
        setImporting(false);
        return;
      }

      // Find available slots (1-6)
      const usedSlots = new Set(team.members.map(m => m.slot));
      const availableSlots = [1, 2, 3, 4, 5, 6].filter(s => !usedSlots.has(s));

      if (availableSlots.length === 0) {
        setImportError(t('teams_import_team_full'));
        setImporting(false);
        return;
      }

      const toImport = parsed.slice(0, availableSlots.length);
      let added = 0;
      const failed: string[] = [];

      for (let i = 0; i < toImport.length; i++) {
        const resolved = await resolveShowdownMon(toImport[i], availableSlots[i]);
        if (resolved) {
          await addMember(team.id, resolved);
          added++;
        } else {
          failed.push(toImport[i].name);
        }
      }

      if (added > 0) {
        const msg = t('teams_import_success', { count: added });
        const failMsg = failed.length > 0
          ? ` ${t('teams_import_failed', { names: failed.join(', ') })}`
          : '';
        setImportSuccess(msg + failMsg);
        setImportText('');
        setTimeout(() => {
          setShowImport(false);
          setImportSuccess(null);
        }, 2500);
      } else {
        setImportError(t('teams_import_none_resolved', { names: failed.join(', ') }));
      }
    } catch {
      setImportError(t('teams_import_error'));
    } finally {
      setImporting(false);
    }
  };

  const slotMap = Object.fromEntries(team.members.map(m => [m.slot, m]));

  return (
    <div className="bg-[var(--color-card)] rounded-2xl shadow-lg overflow-hidden border border-[var(--color-border)] animate-slide-up">
      {/* Accent bar */}
      <div className="accent-bar" />

      {/* Header: name + count + export + delete */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-[var(--color-border)]">
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
            className="flex-1 px-2 py-1 rounded border border-[var(--color-primary)] bg-[var(--color-card)] text-[var(--text-primary)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title={t('teams_rename_team')}
            className="flex-1 text-left font-bold text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors duration-200 text-sm cursor-pointer"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {team.name}
          </button>
        )}

        <span className="text-xs text-[var(--text-muted)] shrink-0">
          {team.members.length}/6
        </span>

        <button
          onClick={() => { setShowImport(true); setImportError(null); setImportSuccess(null); }}
          className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer bg-[var(--color-card-alt)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-border)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('teams_import_showdown')}
        </button>

        {team.members.length > 0 && (
          <button
            onClick={handleExport}
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              copied
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card-alt)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {copied ? t('teams_copied') : t('teams_export_showdown')}
          </button>
        )}

        <button
          onClick={handleDelete}
          className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
            confirmDelete
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
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
                className="w-12 h-12 rounded-full bg-[var(--color-card-alt)] flex items-center justify-center shrink-0 overflow-hidden border border-[var(--color-border)]"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${resolveSprite(member.pokemon_name, member.pokemon_id)}.png`}
                  alt={member.pokemon_name}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                key={slot}
                className="w-12 h-12 rounded-full border-2 border-dashed border-[var(--color-border)] flex items-center justify-center shrink-0"
                aria-label={`Empty slot ${slot}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            );
          })}
        </div>

        {/* Edit Team button */}
        <button
          onClick={() => navigate(`/teamsbuilder/${team.id}`)}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {t('teams_edit')}
        </button>
      </div>

      {/* Import modal — portaled to body to escape overflow-hidden */}
      {showImport && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => !importing && setShowImport(false)}>
          <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="px-5 pt-5 pb-3 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('teams_import_showdown')}
              </h3>
              <button
                onClick={() => !importing && setShowImport(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-sm text-[var(--text-secondary)]">
                {t('teams_import_hint')}
              </p>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={`Garchomp @ Life Orb\nAbility: Rough Skin\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Earthquake\n- Outrage\n- Swords Dance\n- Stone Edge`}
                className="w-full h-48 px-3 py-2 rounded-lg bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-primary)] text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-muted)]"
                disabled={importing}
              />

              {importError && (
                <p className="text-sm text-red-500 font-medium">{importError}</p>
              )}
              {importSuccess && (
                <p className="text-sm text-emerald-500 font-medium">{importSuccess}</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowImport(false)}
                  disabled={importing}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('teams_import_cancel')}
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || !importText.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {importing && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {importing ? t('teams_import_importing') : t('teams_import_button')}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default TeamSummaryCard;
