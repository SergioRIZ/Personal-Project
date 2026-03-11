import { useState } from 'react';
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
    <div className="min-h-screen app-bg flex justify-center items-start pt-20 sm:pt-12 pb-12">
      <div className="container max-w-2xl mx-auto px-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

          {/* Header with diagonal accent */}
          <div className="relative overflow-hidden p-6 border-b border-[var(--color-border)]" style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-card))' }}>
            {/* Geometric decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.05]">
              <svg viewBox="0 0 100 100">
                <circle cx="80" cy="20" r="60" fill="var(--color-primary)" />
              </svg>
            </div>
            <div className="flex items-center justify-between relative">
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                  {t('settings')}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                resetConfirm
                  ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                  : 'bg-[var(--color-card-alt)] border border-[var(--color-border)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
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
