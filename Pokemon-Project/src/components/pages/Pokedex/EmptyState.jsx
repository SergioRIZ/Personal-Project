import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const EmptyState = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="relative w-32 h-32 mb-8">
      <div className="absolute w-full h-full rounded-full border-8 border-slate-200 border-t-green-500 animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-16 h-16 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
    
    <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-2">{t('startSearching')}</h2>
    <p className="text-green-600 max-w-md font-bold">{t('typeToSearch')}</p>
  </div>
  );
};

export default EmptyState;