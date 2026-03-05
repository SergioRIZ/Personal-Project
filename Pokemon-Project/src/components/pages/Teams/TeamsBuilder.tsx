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
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const team = teams.find(tm => tm.id === teamId);

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-1">
            {t('teams_not_found', 'Team not found')}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
            {t('teams_not_found_desc', 'This team may have been deleted.')}
          </p>
          <button
            onClick={() => navigate('/teams')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors duration-200 cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      {/* Back link */}
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          to="/teams"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200"
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
