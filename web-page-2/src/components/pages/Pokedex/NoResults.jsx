import React from 'react';
import { useTranslation } from 'react-i18next';

const NoResults = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <div className="inline-block mb-4">
        <img src="/api/placeholder/100/100" alt="Pokeball vacía" className="h-20 w-20 mx-auto opacity-30" />
      </div>
      <p className="text-gray-600 text-xl mb-2">{t('noResults')}</p>
      <p className="text-gray-500">{t('tryAgain')}</p>
    </div>
  );
};

export default NoResults;