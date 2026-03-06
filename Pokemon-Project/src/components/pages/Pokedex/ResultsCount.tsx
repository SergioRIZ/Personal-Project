import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  filteredCount: number;
  totalCount: number;
}

const ResultsCount = ({ filteredCount, totalCount }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto mb-6 px-4">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-md p-4 flex items-center gap-3">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)]" />
        <p className="text-[var(--text-primary)] font-medium" style={{ fontFamily: 'var(--font-display)' }}>
          {t('showing')}{' '}
          <span className="font-bold text-[var(--color-primary)] text-lg">{filteredCount}</span>{' '}
          {t('of')}{' '}
          <span className="font-bold text-[var(--text-primary)]">{totalCount}</span>{' '}
          {t('pokemon')}
        </p>
      </div>
    </div>
  );
};

export default ResultsCount;
