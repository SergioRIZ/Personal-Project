import React from 'react';
import { useTranslation } from 'react-i18next';

const ResultsCount = ({ filteredCount, totalCount }) => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-6xl mx-auto mb-6 px-4">
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center border-l-4 border-red-500">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">
          <span className="font-bold">#</span>
        </div>
        <p className="text-gray-700 font-medium">
          {t('showing')} <span className="font-bold text-red-600">{filteredCount}</span> {t('of')} <span className="font-bold text-red-600">{totalCount}</span> {t('pokemon')}
        </p>
      </div>
    </div>
  );
};

export default ResultsCount;