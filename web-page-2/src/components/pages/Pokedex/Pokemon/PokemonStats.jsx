import React from 'react';
import { useTranslation } from 'react-i18next';
import { getStatColor, translateStatName } from '../utils';

const PokemonStats = ({ stats, currentLanguage }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="font-bold text-gray-700 mb-2 text-center border-b border-gray-200 pb-1">{t('baseStats')}</h3>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.stat.name} className="flex items-center">
            <div className="w-28 text-xs font-medium capitalize text-gray-600">
              {translateStatName(stat.stat.name, currentLanguage)}:
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStatColor(stat.stat.name)}`} 
                style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
              ></div>
            </div>
            <div className="w-10 text-right text-xs font-bold ml-1 text-gray-700">
              {stat.base_stat}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonStats;