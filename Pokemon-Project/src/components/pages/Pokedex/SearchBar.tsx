import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, handleSearch }: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === '') handleSearch(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch({ target: { value: inputValue } } as React.ChangeEvent<HTMLInputElement>);
    }
    if (e.key === 'Backspace' && inputValue.length === 1) {
      setInputValue('');
      handleSearch({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSearchClick = () => {
    handleSearch({ target: { value: inputValue } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          className="w-full p-4 pl-12 border-2 border-slate-300 dark:border-gray-600 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm transition-all duration-300"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label={t('searchPlaceholder')}
        />
        <button
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          onClick={handleSearchClick}
          aria-label="Search"
        >
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
