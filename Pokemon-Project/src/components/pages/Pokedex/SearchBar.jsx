import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

const SearchBar = ({ searchTerm, handleSearch }) => {
  const { t } = useTranslation();
  
  return (
<div className="max-w-2xl mx-auto mb-8">
  <div className="relative">
    <input
      type="text"
      placeholder={t('searchPlaceholder')}
      className="w-full p-4 pl-12 border-2 border-slate-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
      value={searchTerm}
      onChange={handleSearch}
    />
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
</div>
  );
};

export default SearchBar;