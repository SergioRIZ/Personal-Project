import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingScreen = ({ loadingProgress }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-red-50">
      <div className="w-64 h-64 relative mb-8">
        <div className="absolute inset-0 rounded-full border-8 border-gray-300 border-t-red-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/web-page-2/public/pokemon.svg" alt="Pokeball" className="h-32 w-32 animate-pulse" />
        </div>
      </div>
      <p className="text-2xl font-bold text-red-600 mb-2">{t('loading')}</p>
      <div className="w-64 bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className="bg-red-600 h-4 rounded-full transition-all duration-300" 
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p className="text-gray-700">{loadingProgress}% {t('completed')}</p>
    </div>
  );
};

export default LoadingScreen;