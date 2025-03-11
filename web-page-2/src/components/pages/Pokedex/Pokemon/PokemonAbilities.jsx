import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '../Tooltip';

const PokemonAbilities = ({ abilities, abilityDescriptions }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-3">
      <h4 className="text-xs font-bold text-gray-600 mb-1">{t('abilities')}:</h4>
      <div className="flex flex-wrap gap-1">
        {abilities.map((ability) => {
          const abilityInfo = abilityDescriptions[ability.ability.name];
          const tooltipContent = (
            <div>
              <p className="font-bold text-gray-800 capitalize mb-1">
                {abilityInfo?.name || ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && <span className="ml-1 text-gray-500 text-xs italic">({t('hidden')})</span>}
              </p>
              <p className="text-gray-600 text-sm">
                {abilityInfo?.description || 'Cargando descripción...'}
              </p>
            </div>
          );
          
          return (
            <Tooltip key={ability.ability.name} content={tooltipContent}>
              <span 
                className={`cursor-help px-2 py-1 bg-red-50 border border-red-100 rounded text-xs capitalize text-red-700 ${ability.is_hidden ? 'italic' : ''}`}
              >
                {ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && <span className="text-xs ml-1 text-gray-500">(O)</span>}
              </span>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonAbilities;