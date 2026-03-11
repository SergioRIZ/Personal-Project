import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTeams } from '../../../context/TeamsContext';
import { navigate } from '../../../navigation';
import { Link } from '../../../Link';
import TeamSummaryCard from './TeamSummaryCard';

const Teams: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { teams, loading: teamsLoading, createTeam } = useTeams();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]" style={{ animation: 'pokeball-spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    const teamName = `Team ${teams.length + 1}`;
    await createTeam(teamName);
    setCreating(false);
  };

  return (
    <div className="min-h-screen app-bg pt-16 sm:pt-8 pb-8 px-4">
      {/* Back link */}
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t('teams_back')}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page header */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          <div className="accent-bar" />
          <div className="p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('teams_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                {t('teams_subtitle')}
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {creating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {t('teams_new_team')}
            </button>
          </div>
        </div>

        {/* Teams list */}
        {teamsLoading ? (
          <div className="flex justify-center py-16">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]" style={{ animation: 'pokeball-spin 0.8s linear infinite' }} />
            </div>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl animate-slide-up delay-1">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--color-card-alt)] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-[var(--text-primary)] font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {t('teams_empty')}
            </p>
            <p className="text-[var(--text-muted)] text-sm">
              {t('teams_create_first')}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {teams.map(team => (
              <TeamSummaryCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
