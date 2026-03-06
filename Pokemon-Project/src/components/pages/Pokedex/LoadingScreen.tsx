import { useTranslation } from 'react-i18next';

interface Props {
  loadingProgress: number;
}

const LoadingScreen = ({ loadingProgress }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-screen app-bg">
      {/* Pokeball spinner */}
      <div className="relative w-32 h-32 mb-10">
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ animation: 'pokeball-wobble 1.2s ease-in-out infinite' }}>
          {/* Top half - red */}
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="var(--color-primary)" stroke="var(--color-border)" strokeWidth="3" />
          {/* Bottom half - white */}
          <path d="M 5 50 A 45 45 0 0 0 95 50" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="3" />
          {/* Center line */}
          <line x1="5" y1="50" x2="95" y2="50" stroke="var(--color-border)" strokeWidth="3" />
          {/* Center button */}
          <circle cx="50" cy="50" r="12" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="3" />
          <circle cx="50" cy="50" r="6" fill="var(--color-primary)" />
        </svg>
      </div>

      {/* Progress bar */}
      <div className="w-64 bg-[var(--color-border)] rounded-full h-3 mb-3 shadow-inner overflow-hidden" role="progressbar" aria-valuenow={loadingProgress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
          style={{
            width: `${loadingProgress}%`,
            background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'slide-up 1.5s ease-in-out infinite' }} />
        </div>
      </div>

      <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-display)' }}>
        <span className="text-2xl font-bold text-[var(--color-primary)] tabular-nums">{loadingProgress}%</span>
        {' '}
        <span className="text-sm uppercase tracking-wider">{t('completed')}</span>
      </p>
    </div>
  );
};

export default LoadingScreen;
