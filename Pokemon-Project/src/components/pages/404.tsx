import { navigate } from '../../navigation';
import { useTranslation } from 'react-i18next';

export default function Page404() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-4">
      <div className="text-center animate-slide-up">
        {/* Large 404 with diagonal accent */}
        <div className="relative inline-block mb-6">
          <span
            className="text-[8rem] sm:text-[12rem] font-extrabold leading-none gradient-text select-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            404
          </span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full" />
        </div>

        {/* Pokeball icon */}
        <div className="w-16 h-16 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
            <path d="M 5 50 A 45 45 0 0 1 95 50" fill="var(--color-primary)" stroke="var(--color-border)" strokeWidth="3" />
            <path d="M 5 50 A 45 45 0 0 0 95 50" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="3" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="var(--color-border)" strokeWidth="3" />
            <circle cx="50" cy="50" r="12" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="3" />
            <circle cx="50" cy="50" r="5" fill="var(--color-primary)" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {t('page_404_title')}
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
          {t('page_404_desc')}
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t('page_404_cta')}
        </button>
      </div>
    </div>
  );
}
