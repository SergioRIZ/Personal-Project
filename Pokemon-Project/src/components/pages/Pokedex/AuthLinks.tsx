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
    <div className="absolute right-4 top-4 flex items-center gap-2 z-20">

      {user ? null : (
        /* Guest: login + signup links */
        <div className="flex items-center gap-1 bg-[var(--color-card)]/80 backdrop-blur-md rounded-xl border border-[var(--color-border)] p-1">
          {guestLinks.map(({ key, to, label, icon }) => (
            <Link
              key={key}
              to={to}
              className={`relative px-3 sm:px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                hovered === key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--text-primary)] hover:text-[var(--color-primary)]'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  {icon}
                </svg>
                <span className="hidden sm:inline">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default AuthLinks;
