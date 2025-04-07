import React from 'react';
import { useTranslation } from '../../../../../node_modules/react-i18next';
import { getStatColor, translateStatName } from '../utils';

const PokemonStats = ({ stats, currentLanguage }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-3 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
      <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-center border-b border-gray-200 dark:border-gray-600 pb-1">
        {t('baseStats')}
      </h3>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.stat.name} className="flex items-center">
            <div className="w-28 text-xs font-medium capitalize text-gray-600 dark:text-gray-300">
              {translateStatName(stat.stat.name, currentLanguage)}:
            </div>
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStatColor(stat.stat.name)} transition-all duration-500 ease-out`} 
                style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
              ></div>
            </div>
            <div className="w-10 text-right text-xs font-bold ml-1 text-gray-700 dark:text-gray-300">
              {stat.base_stat}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonStats;