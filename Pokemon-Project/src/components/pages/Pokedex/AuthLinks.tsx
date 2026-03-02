import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../Link';
import { useAuth } from '../../../context/AuthContext';

const AuthLinks = () => {
  const { t } = useTranslation();
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
