import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const ResultsCount = ({ filteredCount, totalCount }) => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-6xl mx-auto mb-6 px-4">
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 flex items-center border-l-4 border-slate-500">
      <p className="text-slate-700 font-medium">
        {t('showing')} <span className="font-bold text-green-600">{filteredCount}</span> {t('of')} <span className="font-bold text-slate-600">{totalCount}</span> {t('pokemon')}
      </p>
    </div>
  </div>
  );
};

export default ResultsCount;