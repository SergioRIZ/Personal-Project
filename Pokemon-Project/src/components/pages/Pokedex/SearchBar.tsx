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
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full p-4 pl-13 border-2 border-[var(--color-border)] rounded-2xl shadow-md focus:outline-none focus:border-[var(--color-primary)] text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--color-card)] transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label={t('searchPlaceholder')}
          />
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
