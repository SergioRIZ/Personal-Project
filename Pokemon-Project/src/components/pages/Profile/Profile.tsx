import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useCollection } from '../../../context/CollectionContext';
import { navigate } from '../../../navigation';
import { Link } from '../../../Link';
import PokemonAvatar from '../../shared/PokemonAvatar';
import AvatarPicker from '../../shared/AvatarPicker';

const Profile = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { collectionItems, loading: collectionLoading, removePokemon } = useCollection();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarId, setAvatarId] = useState<string | null>(
    () => (user?.user_metadata?.avatar_id as string) ?? null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]" style={{ animation: 'pokeball-spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const joinedDate = new Date(user.created_at ?? '').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen app-bg pt-20 sm:pt-8 pb-8 px-4">
      {/* Back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('profile_back')}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* User card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          <div className="accent-bar" />
          <div className="p-4 sm:p-6 flex flex-wrap items-center gap-4">
            <PokemonAvatar
              user={user}
              size="lg"
              onClick={() => setShowAvatarPicker(true)}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('profile_title')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] truncate">{user.email}</p>
              {user.created_at && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {joinedDate}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto flex-wrap">
              <Link
                to="/teams"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                </svg>
                {t('profile_teams_link')}
              </Link>
              <Link
                to="/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {t('settings')}
              </Link>
            </div>
          </div>
        </div>

        {/* Collection section */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-slide-up delay-3">
          <div className="accent-bar" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('profile_collection_title')}
              </h2>
              {!collectionLoading && (
                <span className="ml-auto text-sm text-[var(--color-primary)] font-bold bg-[var(--color-primary-light)] px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-display)' }}>
                  {collectionItems.length} {t('pokemon')}
                </span>
              )}
            </div>

            {collectionLoading ? (
              <div className="flex justify-center py-12">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]" style={{ animation: 'pokeball-spin 0.8s linear infinite' }} />
                </div>
              </div>
            ) : collectionItems.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-card-alt)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] font-medium">
                  {t('profile_no_pokemon')}
                </p>
                <Link
                  to="/pokedex"
                  className="text-sm text-[var(--color-primary)] hover:underline font-bold"
                >
                  {t('profile_go_pokedex')}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {collectionItems.map(item => (
                  <div
                    key={item.pokemon_id}
                    className="relative group bg-[var(--color-card-alt)] rounded-xl p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200 border border-[var(--color-border)]"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removePokemon(item.pokemon_id)}
                      aria-label={t('collection_remove')}
                      className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Sprite */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.pokemon_id}.png`}
                      alt={item.pokemon_name}
                      className="w-16 h-16 object-contain drop-shadow-md"
                      loading="lazy"
                    />

                    {/* Name + ID */}
                    <div className="text-center w-full">
                      <p className="text-xs font-bold capitalize text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.pokemon_name.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-display)' }}>
                        #{item.pokemon_id.toString().padStart(4, '0')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar picker modal */}
      {showAvatarPicker && (
        <AvatarPicker
          currentAvatarId={avatarId}
          onSelect={setAvatarId}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
};

export default Profile;
