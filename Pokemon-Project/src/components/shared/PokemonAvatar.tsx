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

  if (avatarId) {
    return (
      <div
        onClick={onClick}
        className={`${sizeClass} rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center select-none shadow-lg shrink-0 ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-slate-400 dark:hover:ring-green-400 transition-all' : ''}`}
      >
        <img
          src={getAvatarUrl(avatarId)}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${sizeClass} rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold select-none shadow-lg shrink-0 ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-slate-400 dark:hover:ring-green-400 transition-all' : ''}`}
    >
      {user.email?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
};

export default PokemonAvatar;
