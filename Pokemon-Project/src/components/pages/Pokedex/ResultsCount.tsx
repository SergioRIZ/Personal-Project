import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  filteredCount: number;
  totalCount: number;
}

const ResultsCount = ({ filteredCount, totalCount }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto mb-6 px-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md p-4 flex items-center border-l-4 border-slate-500 dark:border-slate-400">
        <p className="text-slate-700 dark:text-slate-200 font-medium">
          {t('showing')} <span className="font-bold text-green-600 dark:text-green-400">{filteredCount}</span>{' '}
          {t('of')} <span className="font-bold text-slate-600 dark:text-slate-300">{totalCount}</span>{' '}
          {t('pokemon')}
        </p>
      </div>
    </div>
  );
};

export default ResultsCount;
