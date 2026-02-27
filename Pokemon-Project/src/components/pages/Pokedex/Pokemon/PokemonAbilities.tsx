import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '../Tooltip';
import type { AbilityMap } from '../ApiService';

interface AbilityEntry {
  ability: { name: string; url: string };
  is_hidden: boolean;
}

interface Props {
  abilities: AbilityEntry[];
  abilityDescriptions: AbilityMap;
}

const PokemonAbilities = ({ abilities, abilityDescriptions }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mt-3">
      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('abilities')}:</h4>
      <div className="flex flex-wrap gap-1">
        {abilities.map(ability => {
          const info = abilityDescriptions[ability.ability.name];
          const name = info?.name ?? ability.ability.name.replace('-', ' ');
          const description = info?.description ?? 'Loading...';

          const tooltipContent = (
            <div>
              <p className="font-bold text-slate-800">
                {name}
                {ability.is_hidden && (
                  <span className="ml-1 text-slate-500 text-xs italic">({t('hidden')})</span>
                )}
              </p>
              <p className="text-slate-600 text-sm">{description}</p>
            </div>
          );

          return (
            <Tooltip key={ability.ability.name} content={tooltipContent}>
              <span className={`cursor-help px-2 py-1 bg-gradient-to-r from-green-50 to-slate-100 dark:from-green-900/30 dark:to-slate-700/40 border border-slate-200 dark:border-slate-600 rounded text-xs capitalize text-green-700 dark:text-green-400 shadow-sm ${ability.is_hidden ? 'italic' : ''}`}>
                {name}
                {ability.is_hidden && (
                  <span className="text-xs ml-1 text-slate-500 dark:text-slate-400">
                    ({t('hidden').charAt(0)})
                  </span>
                )}
              </span>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonAbilities;
