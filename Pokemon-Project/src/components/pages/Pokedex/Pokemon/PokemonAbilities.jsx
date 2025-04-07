import React from 'react';
import { useTranslation } from '../../../../../node_modules/react-i18next';
import Tooltip from '../Tooltip';

const PokemonAbilities = ({ abilities, abilityDescriptions }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-3">
      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('abilities')}:</h4>
      <div className="flex flex-wrap gap-1">
        {abilities.map((ability) => {
          const abilityInfo = abilityDescriptions[ability.ability.name];
          const abilityKey = `abilities.${ability.ability.name}`;
          
          // Try to get the ability translation, or use the formatted name if it doesn't exist
          const abilityName = t(abilityKey, {
            defaultValue: abilityInfo?.name || ability.ability.name.replace('-', ' ')
          });
          
          // Try to get the translated description, or use the English description if it exists
          const abilityDescription = t(`${abilityKey}.description`, {
            defaultValue: abilityInfo?.description || 'Cargando descripción...'
          });
          
          const tooltipContent = (
            <div>
              <p className="font-bold text-slate-800 capitalize mb-1">
                {abilityName}
                {ability.is_hidden && <span className="ml-1 text-slate-500 text-xs italic">({t('hidden')})</span>}
              </p>
              <p className="text-slate-600 text-sm">
                {abilityDescription}
              </p>
            </div>
          );
          
          return (
            <Tooltip key={ability.ability.name} content={tooltipContent}>
              <span
                className={`cursor-help px-2 py-1 bg-gradient-to-r from-green-50 to-slate-100 dark:from-green-900/30 dark:to-slate-700/40 border border-slate-200 dark:border-slate-600 rounded text-xs capitalize text-green-700 dark:text-green-400 shadow-sm transition-colors duration-300 ${ability.is_hidden ? 'italic' : ''}`}
              >
                {abilityName}
                {ability.is_hidden && <span className="text-xs ml-1 text-slate-500 dark:text-slate-400">({t('hidden').charAt(0)})</span>}
              </span>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonAbilities;