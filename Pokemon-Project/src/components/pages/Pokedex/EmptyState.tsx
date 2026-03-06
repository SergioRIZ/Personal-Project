import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      {/* Pokeball with search icon integrated in a single SVG */}
      <div className="w-36 h-36 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Pokeball dashed outline */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 4" opacity="0.2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 4" opacity="0.2" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.2" />
          {/* Search icon centered at 50,50 */}
          <circle cx="47" cy="47" r="11" fill="none" stroke="var(--color-primary)" strokeWidth="3" opacity="0.6" />
          <line x1="55" y1="55" x2="63" y2="63" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {t('startSearching')}
      </h2>
      <p className="text-[var(--color-primary)] max-w-md font-bold text-sm uppercase tracking-wider">
        {t('typeToSearch')}
      </p>
    </div>
  );
};

export default EmptyState;
