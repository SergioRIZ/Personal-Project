import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTeams } from '../../../context/TeamsContext';
import { navigate } from '../../../navigation';
import { Link } from '../../../Link';
import TeamCard from './TeamCard';

const TeamsBuilder: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { teams, loading: teamsLoading } = useTeams();

  // Extract team ID from URL: /teamsbuilder/<uuid>
  const teamId = window.location.pathname.split('/').pop() ?? '';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading]);

  if (authLoading || teamsLoading) {
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

  const team = teams.find(tm => tm.id === teamId);

  if (!team) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="text-center bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl p-10 animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-card-alt)] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {t('teams_not_found', 'Team not found')}
          </p>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            {t('teams_not_found_desc', 'This team may have been deleted.')}
          </p>
          <button
            onClick={() => navigate('/teams')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm rounded-xl shadow-md transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t('teams_back', 'Back to Teams')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg py-8 px-4">
      {/* Back link */}
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          to="/teams"
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
          {t('teams_back', 'Back to Teams')}
        </Link>
      </div>

      {/* Full team builder */}
      <div className="max-w-5xl mx-auto">
        <TeamCard team={team} />
      </div>
    </div>
  );
};

export default TeamsBuilder;
