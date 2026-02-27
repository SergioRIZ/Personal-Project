import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../Link';
import { useSettings } from '../../../context/SettingsContext';
import { useAuth } from '../../../context/AuthContext';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

const AuthLinks = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const { user } = useAuth();
  const [hovered, setHovered] = useState<'login' | 'signup' | null>(null);

  const guestLinks = [
    {
      key: 'login' as const,
      to: '/login',
      label: t('login'),
      icon: <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />,
    },
    {
      key: 'signup' as const,
      to: '/signup',
      label: t('signup'),
      icon: <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />,
    },
  ];

  return (
    <div className="absolute right-4 top-4 flex items-center gap-2">

      {/* Dark / Light toggle */}
      <button
        onClick={() => updateSetting('darkMode', !settings.darkMode)}
        aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 dark:bg-gray-700/60 text-slate-600 dark:text-yellow-300 hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-200 cursor-pointer backdrop-blur-sm shadow border border-white/40 dark:border-gray-600"
      >
        {settings.darkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      {user ? (
        /* Logged in: avatar links to profile */
        <Link to="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm select-none shadow cursor-pointer hover:opacity-90 transition-opacity duration-200">
            {user.email?.[0]?.toUpperCase() ?? '?'}
          </div>
        </Link>
      ) : (
        /* Guest: login + signup links */
        <div className="flex items-center bg-white/10 dark:bg-gray-800/20 rounded-t-lg">
          {guestLinks.map(({ key, to, label, icon }) => (
            <Link
              key={key}
              to={to}
              className={`relative px-2 sm:px-5 py-2 text-sm font-medium transition-all duration-300 ${
                hovered === key
                  ? 'bg-white/20 dark:bg-gray-700/50 text-green-700 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300'
              } hover:text-green-700 dark:hover:text-green-400`}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  {icon}
                </svg>
                <span className="hidden sm:inline">{label}</span>
              </div>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 ${hovered === key ? 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`} />
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default AuthLinks;
