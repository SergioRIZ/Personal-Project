import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ currentLanguage, setCurrentLanguage }) => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <div className="flex justify-center mt-4">
      <button 
        onClick={() => changeLanguage('es')} 
        className={`px-3 py-1 rounded-l-lg ${currentLanguage === 'es' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        ES
      </button>
      <button 
        onClick={() => changeLanguage('en')} 
        className={`px-3 py-1 rounded-r-lg ${currentLanguage === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;