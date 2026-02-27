import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const LanguageSelector = ({ currentLanguage, setCurrentLanguage }: Props) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <div className="mt-4 flex justify-center">
      <div className="inline-flex shadow-lg rounded-lg overflow-hidden">
        {(['es', 'en'] as const).map((lang, idx) => (
          <React.Fragment key={lang}>
            {idx > 0 && <div className="w-px bg-slate-300" />}
            <button
              onClick={() => changeLanguage(lang)}
              className={`px-4 py-2 font-medium text-sm transition-all duration-300 cursor-pointer ${
                currentLanguage === lang
                  ? 'bg-gradient-to-r from-green-600 to-slate-600 text-white font-semibold'
                  : 'bg-gradient-to-r from-green-50 to-slate-200 text-slate-700 hover:from-green-100 hover:to-slate-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
