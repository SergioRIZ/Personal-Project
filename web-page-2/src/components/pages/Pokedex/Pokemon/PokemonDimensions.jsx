import React from 'react';
import { useTranslation } from 'react-i18next';

const PokemonDimensions = ({ height, weight }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="text-center p-1 bg-blue-50 rounded border border-blue-100">
        <p className="text-xs text-blue-700 font-medium">{t('height')}</p>
        <p className="font-bold text-gray-700">{(height / 10).toFixed(1)} {t('m')}</p>
      </div>
      <div className="text-center p-1 bg-amber-50 rounded border border-amber-100">
        <p className="text-xs text-amber-700 font-medium">{t('weight')}</p>
        <p className="font-bold text-gray-700">{(weight / 10).toFixed(1)} {t('kg')}</p>
      </div>
    </div>
  );
};

export default PokemonDimensions;