import React from 'react';
import { useTranslation } from '../../../../../node_modules/react-i18next';

const PokemonDimensions = ({ height, weight }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="text-center p-1 bg-green-50 dark:bg-green-900/30 rounded border border-green-100 dark:border-green-800 shadow-sm transition-colors duration-300">
        <p className="text-xs text-green-700 dark:text-green-400 font-medium">{t('height')}</p>
        <p className="font-bold text-slate-700 dark:text-slate-300">{(height / 10).toFixed(1)} {t('m')}</p>
      </div>
      <div className="text-center p-1 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{t('weight')}</p>
        <p className="font-bold text-slate-700 dark:text-slate-300">{(weight / 10).toFixed(1)} {t('kg')}</p>
      </div>
    </div>
  );
};

export default PokemonDimensions;