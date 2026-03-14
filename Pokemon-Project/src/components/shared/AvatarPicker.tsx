import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AVATAR_CHARACTERS, AVATAR_CATEGORIES, getAvatarUrl } from '../../lib/avatars';
import { updateAvatar } from '../../lib/auth';

const CATEGORY_LABELS: Record<string, string> = {
  protagonist: 'avatar_category_protagonist',
  rival: 'avatar_category_rival',
  'gym-leader': 'avatar_category_gym',
  elite: 'avatar_category_elite',
  villain: 'avatar_category_villain',
  professor: 'avatar_category_professor',
  frontier: 'avatar_category_frontier',
  notable: 'avatar_category_notable',
};

interface Props {
  currentAvatarId: string | null;
  onSelect: (avatarId: string | null) => void;
  onClose: () => void;
}

const AvatarPicker = ({ currentAvatarId, onSelect, onClose }: Props) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll + Escape key + focus trap
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const handleSelect = async (avatarId: string | null) => {
    await updateAvatar(avatarId);
    onSelect(avatarId);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-picker-title"
        tabIndex={-1}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 id="avatar-picker-title" className="text-lg font-bold text-gray-900 dark:text-white">
            {t('avatar_title')}
          </h2>
          <button
            onClick={onClose}
            aria-label={t('closeMenu', 'Close')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Remove avatar option */}
          {currentAvatarId && (
            <button
              onClick={() => handleSelect(null)}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              {t('avatar_remove')}
            </button>
          )}

          {/* Character grid by category */}
          {AVATAR_CATEGORIES.map(category => {
            const characters = AVATAR_CHARACTERS.filter(c => c.category === category);
            if (characters.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
                  {t(CATEGORY_LABELS[category])}
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {characters.map(char => {
                    const isSelected = currentAvatarId === char.id;
                    return (
                      <button
                        key={char.id}
                        onClick={() => handleSelect(char.id)}
                        aria-label={char.name}
                        title={char.name}
                        className={`relative flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-500 dark:ring-red-400'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                          <img
                            src={getAvatarUrl(char.id)}
                            alt={char.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate w-full text-center">
                          {char.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AvatarPicker;
