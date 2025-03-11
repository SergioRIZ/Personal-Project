import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const ErrorMessage = ({ error }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-12" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <svg className="h-6 w-6 text-red-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">{t('errorTitle')}</p>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;