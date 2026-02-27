import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  loadingProgress: number;
}

const LoadingScreen = ({ loadingProgress }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900">
      <div className="w-64 h-64 relative mb-8">
        <div className="absolute inset-0 rounded-full border-8 border-slate-300 dark:border-gray-700 border-t-teal-500 animate-spin"></div>
      </div>
      <div className="w-64 bg-slate-200 dark:bg-gray-700 rounded-full h-4 mb-2 shadow-inner" role="progressbar" aria-valuenow={loadingProgress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="bg-gradient-to-r from-teal-500 to-blue-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">
        {loadingProgress}% <span className="text-teal-600 dark:text-teal-400">{t('completed')}</span>
      </p>
    </div>
  );
};

export default LoadingScreen;
