import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const LoadingScreen = ({ loadingProgress }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      <div className="w-64 h-64 relative mb-8">
        <div className="absolute inset-0 rounded-full border-8 border-gray-700 border-t-teal-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </div>
      <div className="w-64 bg-gray-700 rounded-full h-4 mb-2 shadow-inner">
        <div 
          className="bg-gradient-to-r from-teal-500 to-blue-500 h-4 rounded-full transition-all duration-300" 
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p className="text-gray-300 font-medium">{loadingProgress}% <span className="text-teal-400">{t('completed')}</span></p>
    </div>
  );
};

export default LoadingScreen;