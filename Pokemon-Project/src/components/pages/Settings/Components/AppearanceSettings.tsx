import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe } from 'lucide-react';
import SettingsSection from './ui/SettingSection';
import { useSettings } from '../../../../context/SettingsContext';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
}

const AppearanceSettings = ({ isExpanded, onToggle }: Props) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();

  return (
    <SettingsSection
      title={t('appearance_title')}
      icon={Sun}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {/* Dark Mode */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {settings.darkMode
            ? <Moon size={18} className="text-blue-400" />
            : <Sun size={18} className="text-yellow-500" />}
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('appearance_dark_mode')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {settings.darkMode ? t('appearance_dark_active') : t('appearance_light_active')}
            </p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={settings.darkMode}
          onClick={() => updateSetting('darkMode', !settings.darkMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
            settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
              settings.darkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Globe size={18} className="text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('appearance_language')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('appearance_language_desc')}
            </p>
          </div>
        </div>
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          {(['es', 'en'] as const).map((lang, idx) => (
            <button
              key={lang}
              onClick={() => updateSetting('language', lang)}
              className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                idx > 0 ? 'border-l border-gray-200 dark:border-gray-600' : ''
              } ${
                settings.language === lang
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
};

export default AppearanceSettings;
