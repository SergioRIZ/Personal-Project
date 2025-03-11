import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const LanguageSelector = ({ currentLanguage, setCurrentLanguage }) => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
<div className="mt-4 flex justify-center">
  <div className="inline-flex shadow-lg rounded-lg overflow-hidden">
    <button 
      onClick={() => changeLanguage('es')} 
      className={`px-4 py-2 font-medium text-sm transition-all duration-300 ${
        currentLanguage === 'es' 
          ? 'bg-gradient-to-r from-green-600 to-slate-600 text-white font-semibold' 
          : 'bg-gradient-to-r from-green-50 to-slate-200 text-slate-700 hover:from-green-100 hover:to-slate-300'
      }`}
    >
      <span className="mr-1">ES</span>
    </button>
    <div className="w-px bg-slate-300"></div>
    <button 
      onClick={() => changeLanguage('en')} 
      className={`px-4 py-2 font-medium text-sm transition-all duration-300 ${
        currentLanguage === 'en' 
          ? 'bg-gradient-to-r from-green-600 to-slate-600 text-white font-semibold' 
          : 'bg-gradient-to-r from-green-50 to-slate-200 text-slate-700 hover:from-green-100 hover:to-slate-300'
      }`}
    >
      <span className="mr-1">EN</span>
    </button>
  </div>
</div>
  );
};

export default LanguageSelector;