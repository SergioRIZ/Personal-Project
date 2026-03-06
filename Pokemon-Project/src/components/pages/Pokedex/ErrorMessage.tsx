import { useTranslation } from 'react-i18next';

interface Props {
  error: string;
}

const ErrorMessage = ({ error }: Props) => {
  const { t } = useTranslation();

  return (
    <div
      className="bg-[var(--color-primary-light)] border-l-4 border-[var(--color-primary)] text-[var(--text-primary)] p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-12 animate-slide-up"
      role="alert"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <p className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{t('errorTitle')}</p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
