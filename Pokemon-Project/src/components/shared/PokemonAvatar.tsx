import type { User } from '@supabase/supabase-js';
import { getAvatarUrl } from '../../lib/avatars';

const SIZES = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl',
} as const;

interface Props {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const PokemonAvatar = ({ user, size = 'md', onClick }: Props) => {
  const avatarId = user.user_metadata?.avatar_id as string | undefined;
  const sizeClass = SIZES[size];

  const baseClass = `${sizeClass} rounded-full flex items-center justify-center select-none shadow-lg shrink-0`;
  const interactiveClass = onClick ? 'cursor-pointer hover:ring-2 hover:ring-slate-400 dark:hover:ring-red-400 transition-all' : '';

  const displayName = user.user_metadata?.full_name || user.email || '';
  const content = avatarId ? (
    <img
      src={getAvatarUrl(avatarId)}
      alt={`${displayName} avatar`}
      className="w-full h-full object-cover"
    />
  ) : (
    <>{user.email?.[0]?.toUpperCase() ?? '?'}</>
  );

  const bgClass = avatarId
    ? 'overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800'
    : 'bg-gradient-to-br from-red-400 to-red-500 text-white font-bold';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${displayName} avatar`}
        className={`${baseClass} ${bgClass} ${interactiveClass}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`${baseClass} ${bgClass}`}>
      {content}
    </div>
  );
};

export default PokemonAvatar;
