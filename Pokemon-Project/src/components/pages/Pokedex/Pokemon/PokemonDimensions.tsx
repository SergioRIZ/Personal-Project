import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  height: number;
  weight: number;
}

const PokemonDimensions = ({ height, weight }: Props) => {
  const { t } = useTranslation();

  const getSizeIndicator = (h: number) => {
    if (h < 7)  return { label: t('small'),      color: 'text-blue-500 dark:text-blue-400' };
    if (h < 15) return { label: t('medium'),     color: 'text-green-600 dark:text-green-400' };
    if (h < 25) return { label: t('large'),      color: 'text-yellow-600 dark:text-yellow-400' };
    return          { label: t('extraLarge'),    color: 'text-red-500 dark:text-red-400' };
  };

  const size = getSizeIndicator(height);

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="text-center p-1 bg-green-50 dark:bg-green-900/80 rounded border border-green-200 dark:border-green-800 shadow-sm">
        <p className="text-xs text-green-700 dark:text-green-400 font-medium">
          {t('height')} <span className={`text-xs ${size.color} ml-1`}>({size.label})</span>
        </p>
        <p className="font-bold text-slate-700 dark:text-slate-200">{(height / 10).toFixed(1)} {t('m')}</p>
      </div>
      <div className="text-center p-1 bg-slate-50/80 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('weight')}</p>
        <p className="font-bold text-slate-700 dark:text-slate-200">{(weight / 10).toFixed(1)} {t('kg')}</p>
      </div>
    </div>
  );
};

export default PokemonDimensions;
