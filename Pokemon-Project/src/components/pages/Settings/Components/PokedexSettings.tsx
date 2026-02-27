import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import SettingsSection from './ui/SettingSection';
import { useSettings, GENERATION_RANGES } from '../../../../context/SettingsContext';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
}

const PokedexSettings = ({ isExpanded, onToggle }: Props) => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();

  const RESULT_LIMITS = [
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: t('pokedex_results_all'), value: null },
  ];

  const toggleGeneration = (gen: number) => {
    const current = settings.generations;
    const updated = current.includes(gen)
      ? current.filter(g => g !== gen)
      : [...current, gen].sort((a, b) => a - b);
    updateSetting('generations', updated);
  };

  const allSelected = settings.generations.length === 0;

  return (
    <SettingsSection
      title={t('pokedex_section_title')}
      icon={Search}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {/* Generation filter */}
      <div className="py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('pokedex_gen_filter')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {allSelected
                ? t('pokedex_all_gens')
                : t('pokedex_gens_selected', { gens: settings.generations.join(', ') })}
            </p>
          </div>
          {!allSelected && (
            <button
              onClick={() => updateSetting('generations', [])}
              className="text-xs text-green-600 dark:text-green-400 hover:underline cursor-pointer"
            >
              {t('pokedex_show_all')}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(GENERATION_RANGES).map(g => {
            const gen = Number(g);
            const [start, end] = GENERATION_RANGES[gen];
            const isSelected = settings.generations.includes(gen);
            return (
              <button
                key={gen}
                onClick={() => toggleGeneration(gen)}
                title={`#${start}–${end}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400'
                }`}
              >
                Gen {gen}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results limit */}
      <div className="py-3">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{t('pokedex_results_limit')}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t('pokedex_results_desc')}
        </p>
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          {RESULT_LIMITS.map(({ label, value }, idx) => (
            <button
              key={label}
              onClick={() => updateSetting('resultsLimit', value)}
              className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                idx > 0 ? 'border-l border-gray-200 dark:border-gray-600' : ''
              } ${
                settings.resultsLimit === value
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
};

export default PokedexSettings;
