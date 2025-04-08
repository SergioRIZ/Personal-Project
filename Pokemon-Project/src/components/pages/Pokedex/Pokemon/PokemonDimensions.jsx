import React from 'react';
import { useTranslation } from '../../../../../node_modules/react-i18next';

const PokemonDimensions = ({ height, weight }) => {
  const { t } = useTranslation();
  
  // Función para calcular el tamaño relativo para la visualización
  const getSizeIndicator = (height) => {
    // En la Pokédex, alturas en decímetros
    if (height < 7) return { label: t('small'), color: 'text-blue-400' };
    if (height < 15) return { label: t('medium'), color: 'text-green-400' };
    if (height < 25) return { label: t('large'), color: 'text-yellow-400' };
    return { label: t('extraLarge'), color: 'text-red-400' };
  };
  
  const sizeInfo = getSizeIndicator(height);
  
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="text-center p-1 bg-green-900/80 dark:bg-green-900/80 rounded border border-green-800 dark:border-green-800 shadow-sm transition-colors duration-300">
        <p className="text-xs text-green-400 dark:text-green-400 font-medium">
          {t('height')} <span className={`text-xs ${sizeInfo.color} ml-1`}>({sizeInfo.label})</span>
        </p>
        <p className="font-bold text-slate-200 dark:text-slate-200">{(height / 10).toFixed(1)} {t('m')}</p>
      </div>
      <div className="text-center p-1 bg-slate-800/80 dark:bg-slate-800/80 rounded border border-slate-700 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">{t('weight')}</p>
        <p className="font-bold text-slate-200 dark:text-slate-200">{(weight / 10).toFixed(1)} {t('kg')}</p>
      </div>
    </div>
  );
};

export default PokemonDimensions;