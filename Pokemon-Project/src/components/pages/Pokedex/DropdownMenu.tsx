import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from '../../../Link';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../navigation';
import { useAuth } from '../../../context/AuthContext';
import { signOut } from '../../../lib/auth';
import { useSettings } from '../../../context/SettingsContext';
import { MoonIcon, SunIcon } from 'lucide-react';

interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const HomeICON = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg> 
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1">
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
  </svg>
);

const PokedexIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="ml-1">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const TeamsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const DropdownMenu = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const { settings, updateSetting } = useSettings();

  const menuItems = useMemo<MenuItem[]>(() => [
    { label: t('home', 'Home'), to: '/', icon: <HomeICON /> },
    { label: 'Pokédex', to: '/pokedex', icon: <PokedexIcon /> },
    { label: t('teams', 'Teams'), to: '/teams', icon: <TeamsIcon /> },
    { label: t('settings', 'Settings'), to: '/settings', icon: <SettingsIcon /> },
  ], [t, i18n.language]);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    setShowButton(false);
    setIsOpen(true);
  };

  const closeMenu = useCallback(() => {
    if (isOpen) setIsOpen(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShowButton(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="z-50">
      {/* Hamburger button — light: white pill, dark: dark pill */}
      <button
        ref={buttonRef}
        className={`fixed top-4 left-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 z-50 border border-gray-200 dark:border-gray-700 transition-colors duration-300 ${showButton ? 'block' : 'hidden'}`}
        onClick={openMenu}
        aria-expanded={isOpen}
        aria-label={t('menu', 'Menu')}
      >
        <span className="text-gray-800 dark:text-white text-xl">☰</span>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      />

      {/* Sidebar — light: white, dark: dark */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-500 ease-in-out z-45 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onTransitionEnd={() => {
          if (!isOpen) setTimeout(() => setShowButton(true), 50);
        }}
      >
        {/* Sidebar header */}
        <div className="p-5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800 dark:text-white">{t('menu', 'Menu')}</span>
          <button
            className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer relative"
            onClick={closeMenu}
            aria-label={t('closeMenu', 'Close menu')}
          >
            <span className="absolute inset-0 flex items-center justify-center text-gray-700 dark:text-white text-xl" style={{ lineHeight: 0, marginTop: '-4px' }}>&times;</span>
          </button>
        </div>

        {/* User profile strip (logged in only) */}
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors duration-200"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              closeMenu();
              setTimeout(() => navigate('/profile'), 50);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
              {user.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{user.email}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">View profile →</p>
            </div>
          </Link>
        )}
        {/* Nav items */}
        <div className="py-3 flex-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center px-5 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                closeMenu();
                if (item.onClick) {
                  item.onClick();
                } else {
                  setTimeout(() => navigate(item.to), 50);
                }
              }}
            >
              <div className="flex items-center w-8">{item.icon}</div>
              <span className="font-medium ml-3">{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className='border-t border-gray-100 dark:border-gray-700 py-2 px-3'>
      <button
        onClick={() => updateSetting('darkMode', !settings.darkMode)}
        aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 dark:bg-gray-700/60 text-slate-600 dark:text-yellow-300 hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-200 cursor-pointer backdrop-blur-sm shadow border border-white/40 dark:border-gray-600"
      >
        {settings.darkMode ? <SunIcon /> : <MoonIcon />}
      </button>
          </div>
        {/* Logout (logged in) / Login+SignUp (guest) */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          {user ? (
            <button
              onClick={async () => {
                closeMenu();
                await signOut();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 text-sm font-medium cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {t('account_sign_out', 'Sign out')}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { closeMenu(); setTimeout(() => navigate('/login'), 50); }}
                className="w-full px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {t('login', 'Login')}
              </button>
              <button
                onClick={() => { closeMenu(); setTimeout(() => navigate('/signup'), 50); }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {t('signup', 'Sign up')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
