import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const NoResults = () => {
  const { t } = useTranslation();
  
  return (
<div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-md max-w-md mx-auto border border-slate-200">
  <div className="inline-block mb-4">
    <img src="/api/placeholder/100/100" alt="Pokeball vacía" className="h-20 w-20 mx-auto opacity-30 filter drop-shadow-md" />
  </div>
  <p className="text-slate-700 text-xl mb-2 font-medium">{t('noResults')}</p>
  <p className="text-green-600">{t('tryAgain')}</p>
</div>
  );
};

export default NoResults;