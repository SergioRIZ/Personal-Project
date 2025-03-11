import React from 'react';
import { useTranslation } from '../../../../../node_modules/react-i18next';

const PokemonDimensions = ({ height, weight }) => {
  const { t } = useTranslation();
  
  return (
<div className="mt-3 grid grid-cols-2 gap-2">
  <div className="text-center p-1 bg-green-50 rounded border border-green-100 shadow-sm">
    <p className="text-xs text-green-700 font-medium">{t('height')}</p>
    <p className="font-bold text-slate-700">{(height / 10).toFixed(1)} {t('m')}</p>
  </div>
  <div className="text-center p-1 bg-slate-50 rounded border border-slate-200 shadow-sm">
    <p className="text-xs text-slate-600 font-medium">{t('weight')}</p>
    <p className="font-bold text-slate-700">{(weight / 10).toFixed(1)} {t('kg')}</p>
  </div>
</div>
  );
};

export default PokemonDimensions;