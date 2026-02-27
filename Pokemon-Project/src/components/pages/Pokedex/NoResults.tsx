import React from 'react';
import { useTranslation } from 'react-i18next';

const NoResults = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md max-w-md mx-auto border border-slate-200 dark:border-slate-700">
      <p className="text-slate-700 dark:text-slate-200 text-xl mb-2 font-medium">{t('noResults')}</p>
      <p className="text-green-600 dark:text-green-400">{t('tryAgain')}</p>
    </div>
  );
};

export default NoResults;
