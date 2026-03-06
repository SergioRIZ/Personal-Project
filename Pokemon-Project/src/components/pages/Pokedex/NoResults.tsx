import React from 'react';
import { useTranslation } from 'react-i18next';

const NoResults = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12 bg-[var(--color-card)] border border-[var(--color-border)] backdrop-blur-sm rounded-2xl shadow-md max-w-md mx-auto animate-slide-up">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
        <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-[var(--text-primary)] text-xl mb-2 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        {t('noResults')}
      </p>
      <p className="text-[var(--color-primary)]">{t('tryAgain')}</p>
    </div>
  );
};

export default NoResults;
