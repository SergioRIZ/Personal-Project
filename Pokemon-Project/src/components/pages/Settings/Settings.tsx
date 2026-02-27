import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pokeball from './Components/ui/Pokeball';
import AppearanceSettings from './Components/AppearanceSettings';
import PokedexSettings from './Components/PokedexSettings';
import AccountSettings from './Components/AccountSettings';
import { useSettings } from '../../../context/SettingsContext';

const Settings = () => {
  const { t } = useTranslation();
  const { resetSettings } = useSettings();
  const [expanded, setExpanded] = useState({ appearance: true, pokedex: false, account: false });
  const [resetConfirm, setResetConfirm] = useState(false);

  const toggle = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReset = () => {
    if (resetConfirm) {
      resetSettings();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 flex justify-center items-start py-12 transition-colors duration-300">
      <div className="container max-w-2xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-slate-100 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-400">
                  {t('settings')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('settings_subtitle')}
                </p>
              </div>
              <Pokeball />
            </div>
          </div>

          {/* Sections */}
          <div className="p-6 space-y-4">
            <AppearanceSettings
              isExpanded={expanded.appearance}
              onToggle={() => toggle('appearance')}
            />
            <PokedexSettings
              isExpanded={expanded.pokedex}
              onToggle={() => toggle('pokedex')}
            />
            <AccountSettings
              isExpanded={expanded.account}
              onToggle={() => toggle('account')}
            />
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-end">
            <button
              onClick={handleReset}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                resetConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {resetConfirm ? t('settings_reset_confirm') : t('settings_reset')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
