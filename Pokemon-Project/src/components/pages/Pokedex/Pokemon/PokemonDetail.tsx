import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePokemonSpecies } from '../../../../hooks/usePokemonSpecies';
import { ALL_TYPES, computeDefensiveMultiplier } from '../../../../lib/typeChart';
import { getTypeSpriteUrl, translateType, translateStatName } from '../utils';
import { fetchAbilityDescriptions, type AbilityMap, type PokemonData } from '../ApiService';
import { navigate } from '../../../../navigation';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import { useCollection } from '../../../../context/CollectionContext';

/* ── Stat bar colors ─────────────────────────────────────────────────── */

const BAR_COLORS: Record<string, string> = {
  hp: 'bg-gradient-to-r from-rose-500 to-red-500',
  attack: 'bg-gradient-to-r from-amber-500 to-orange-500',
  defense: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  'special-attack': 'bg-gradient-to-r from-blue-500 to-indigo-500',
  'special-defense': 'bg-gradient-to-r from-emerald-500 to-green-500',
  speed: 'bg-gradient-to-r from-violet-500 to-purple-500',
};

const TEXT_COLORS: Record<string, string> = {
  hp: 'text-rose-500 dark:text-rose-400',
  attack: 'text-amber-500 dark:text-amber-400',
  defense: 'text-yellow-500 dark:text-yellow-400',
  'special-attack': 'text-blue-500 dark:text-blue-400',
  'special-defense': 'text-emerald-500 dark:text-emerald-400',
  speed: 'text-violet-500 dark:text-violet-400',
};

/* ── Component ──────────────────────────────────────────────────────── */

const PokemonDetailPage = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { collectedIds, addPokemon, removePokemon } = useCollection();
  const currentLanguage = settings.language;

  // Extract ID from URL: /pokemon/25 -> 25
  const pokemonId = Number(window.location.pathname.split('/').pop());

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [abilityDescriptions, setAbilityDescriptions] = useState<AbilityMap>({});
  const [isShiny, setIsShiny] = useState(false);
  const [spriteOpacity, setSpriteOpacity] = useState(1);

  const handleShinyToggle = () => {
    setSpriteOpacity(0);
    setTimeout(() => {
      setIsShiny(s => !s);
      setSpriteOpacity(1);
    }, 150);
  };

  const { species, loading: speciesLoading } = usePokemonSpecies(
    pokemon ? pokemon.id : null,
    currentLanguage,
  );

  // Fetch pokemon data
  useEffect(() => {
    if (!pokemonId || isNaN(pokemonId)) return;

    let cancelled = false;
    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(r => r.json())
      .then((data: PokemonData) => {
        if (cancelled) return;
        setPokemon(data);
        setLoading(false);

        // Fetch ability descriptions
        fetchAbilityDescriptions([data], currentLanguage).then(desc => {
          if (!cancelled) setAbilityDescriptions(desc);
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
          navigate('/pokedex');
        }
      });

    return () => { cancelled = true; };
  }, [pokemonId, currentLanguage]);

  // Keyboard: Escape goes back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/pokedex');
      if (e.key === 'ArrowLeft' && pokemonId > 1) navigate(`/pokemon/${pokemonId - 1}`);
      if (e.key === 'ArrowRight') navigate(`/pokemon/${pokemonId + 1}`);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pokemonId]);

  // Computed values
  const pokemonName = pokemon?.name.replace('-', ' ') ?? '';
  const normalSprite = pokemon
    ? pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
    : '';
  const hasOfficialShiny = !!pokemon?.sprites.other['official-artwork'].front_shiny;
  const shinySprite = pokemon?.sprites.other['official-artwork'].front_shiny || normalSprite;
  const sprite = isShiny ? shinySprite : normalSprite;
  const isCollected = pokemon ? collectedIds.has(pokemon.id) : false;

  const weaknesses = useMemo(() => {
    if (!pokemon) return [];
    const defenderTypes = pokemon.types.map(t => t.type.name);
    return ALL_TYPES
      .map(atkType => ({
        type: atkType,
        multiplier: computeDefensiveMultiplier(atkType, defenderTypes),
      }))
      .filter(w => w.multiplier > 1);
  }, [pokemon]);

  const abilitiesList = pokemon?.abilities.map(a => ({
    name: abilityDescriptions[a.ability.name]?.name ?? a.ability.name.replace('-', ' '),
    isHidden: a.is_hidden,
  })) ?? [];

  const genderDisplay = useMemo(() => {
    if (!species) return null;
    if (species.genderRate === -1) return { genderless: true } as const;
    const femalePct = (species.genderRate / 8) * 100;
    return { genderless: false, male: 100 - femalePct, female: femalePct } as const;
  }, [species]);

  const totalStats = pokemon?.stats.reduce((sum, s) => sum + s.base_stat, 0) ?? 0;

  // Loading state
  if (loading || !pokemon) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)]" style={{ animation: 'pokeball-spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg py-6">
      <div className="container mx-auto px-4 pt-16 sm:pt-10 max-w-4xl">

        {/* ── Rotom Dex Frame ──────────────────────────────── */}
        <div className="relative animate-slide-up mt-6 sm:mt-8">
          {/* Rotom image peeking from top-right */}
          <img
            src="/Context/RotomDex.webp"
            alt=""
            aria-hidden="true"
            className="absolute -top-12 -right-4 sm:-top-16 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 object-contain z-30 drop-shadow-lg pointer-events-none select-none"
            style={{ animation: 'hero-sprite-drift 4s ease-in-out infinite' }}
          />

          {/* Dex body (red frame around the card) */}
          <div className="bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-3xl p-2 sm:p-3 shadow-2xl">
            {/* Screen bezel indicators */}
            <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              <div className="flex-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>

            {/* Screen (main card) */}
            <div className="bg-[var(--color-card)] rounded-2xl shadow-inner overflow-hidden border-2 border-white/20">
              {/* Accent bar */}
              <div className="accent-bar" />

              {/* ── Navigation bar ────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)]">
                {/* Prev */}
                <button
                  onClick={() => pokemonId > 1 && navigate(`/pokemon/${pokemonId - 1}`)}
                  disabled={pokemonId <= 1}
                  className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                    pokemonId > 1
                      ? 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]'
                      : 'text-[var(--text-muted)] cursor-default'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {pokemonId > 1 && (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId - 1}.png`}
                      alt={`#${pokemonId - 1}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  )}
                  <span className="hidden sm:inline">
                    N.° {(pokemonId - 1).toString().padStart(4, '0')}
                  </span>
                </button>

                {/* Back to Pokedex */}
                <button
                  onClick={() => navigate('/pokedex')}
                  className="text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('profile_back')}
                </button>

                {/* Next */}
                <button
                  onClick={() => navigate(`/pokemon/${pokemonId + 1}`)}
                  className="flex items-center gap-1 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="hidden sm:inline">
                    N.° {(pokemonId + 1).toString().padStart(4, '0')}
                  </span>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId + 1}.png`}
                    alt={`#${pokemonId + 1}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold capitalize text-[var(--text-primary)] leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {pokemonName}
              </h1>
              <span className="text-sm font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                N.° {pokemon.id.toString().padStart(4, '0')}
              </span>
            </div>

            {/* Collection button */}
            {user && (
              <button
                onClick={() =>
                  isCollected
                    ? removePokemon(pokemon.id)
                    : addPokemon(pokemon.id, pokemon.name)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isCollected
                    ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                    : 'bg-[var(--color-card-alt)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--text-secondary)] hover:text-[var(--color-primary)]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill={isCollected ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isCollected ? t('collection_remove') : t('collection_add')}
              </button>
            )}
          </div>


          {/* ── Content ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* LEFT: Image */}
            <div className="relative flex flex-col items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, var(--color-card-alt), var(--color-surface))' }}>
              {/* Shiny toggle button */}
              {hasOfficialShiny && (
                <button
                  onClick={handleShinyToggle}
                  aria-label={isShiny ? 'Ver forma normal' : 'Ver forma shiny'}
                  title={isShiny ? 'Ver forma normal' : 'Ver forma shiny'}
                  className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-xl shadow-md transition-all duration-200 cursor-pointer ${
                    isShiny
                      ? 'bg-yellow-400 text-white'
                      : 'bg-[var(--color-card)]/80 hover:bg-[var(--color-card)] text-[var(--text-muted)] hover:text-yellow-400 border border-[var(--color-border)]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={isShiny ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              )}
              {/* Geometric pattern background */}
              <div className="absolute inset-0 opacity-[0.03]">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="detail-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#detail-grid)" />
                </svg>
              </div>

              {/* Pokeball outline — large and centered */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64">
                  <circle cx="100" cy="100" r="93" stroke="var(--color-primary)" strokeWidth="3" fill="none" />
                  <line x1="7" y1="100" x2="193" y2="100" stroke="var(--color-primary)" strokeWidth="3" />
                  <circle cx="100" cy="100" r="24" stroke="var(--color-primary)" strokeWidth="3" fill="none" />
                  <circle cx="100" cy="100" r="10" fill="var(--color-primary)" opacity="0.3" />
                </svg>
              </div>

              <img
                src={sprite}
                alt={pokemonName}
                className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 object-contain animate-float"
                style={{
                  opacity: spriteOpacity,
                  transition: 'opacity 0.15s ease',
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18)) drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
                }}
              />

              {/* Types below image */}
              <div className="flex gap-4 mt-4 relative z-10">
                {pokemon.types.map(({ type }) => (
                  <img
                    key={type.name}
                    src={getTypeSpriteUrl(type.name)}
                    alt={translateType(type.name, currentLanguage)}
                    title={translateType(type.name, currentLanguage)}
                    className="w-20 h-20 object-contain drop-shadow-lg"
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="p-6 space-y-5">
              {/* Description */}
              <div className="min-h-[3rem]">
                {speciesLoading ? (
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-[var(--color-card-alt)] rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-[var(--color-card-alt)] rounded animate-pulse" />
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {species?.description || t('detail_no_description')}
                  </p>
                )}
              </div>

              {/* Info table */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--color-card-alt)] rounded-xl px-3.5 py-2.5 border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('height')}
                  </p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {(pokemon.height / 10).toFixed(1)} {t('m')}
                  </p>
                </div>

                <div className="bg-[var(--color-card-alt)] rounded-xl px-3.5 py-2.5 border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('detail_category')}
                  </p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {speciesLoading ? (
                      <span className="inline-block w-20 h-4 bg-[var(--color-card-alt)] rounded animate-pulse" />
                    ) : (
                      species?.genus || '—'
                    )}
                  </p>
                </div>

                <div className="bg-[var(--color-card-alt)] rounded-xl px-3.5 py-2.5 border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('weight')}
                  </p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {(pokemon.weight / 10).toFixed(1)} {t('kg')}
                  </p>
                </div>

                <div className="bg-[var(--color-card-alt)] rounded-xl px-3.5 py-2.5 border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('detail_ability')}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                    {abilitiesList.map((a, i) => (
                      <span key={i} className={`text-sm font-bold capitalize ${a.isHidden ? 'text-[var(--text-muted)] italic' : 'text-[var(--text-primary)]'}`}>
                        {a.name}{a.isHidden ? ` (${t('detail_hidden_ability')})` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 bg-[var(--color-card-alt)] rounded-xl px-3.5 py-2.5 border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('detail_gender')}
                  </p>
                  {speciesLoading ? (
                    <span className="inline-block w-24 h-4 bg-[var(--color-card-alt)] rounded animate-pulse" />
                  ) : genderDisplay?.genderless ? (
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      {t('detail_genderless')}
                    </p>
                  ) : genderDisplay ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-extrabold text-blue-500">♂ {genderDisplay.male}%</span>
                        <span className="text-lg font-extrabold text-pink-500">♀ {genderDisplay.female}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden bg-pink-400">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${genderDisplay.male}%` }} />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {t('detail_weaknesses')}
                </h3>
                {weaknesses.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] italic">—</p>
                ) : (
                  <div className="bg-[var(--color-card-alt)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {weaknesses.filter(w => w.multiplier === 2).length > 0 && (
                          <tr className={weaknesses.some(w => w.multiplier > 2) ? 'border-b border-[var(--color-border)]' : ''}>
                            <td className="px-3 py-2.5 w-12 align-middle border-r border-[var(--color-border)]">
                              <span className="text-xs font-bold text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-display)' }}>×2</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex flex-wrap gap-1.5">
                                {weaknesses.filter(w => w.multiplier === 2).map(({ type }) => (
                                  <img
                                    key={type}
                                    src={getTypeSpriteUrl(type)}
                                    alt={translateType(type, currentLanguage)}
                                    title={translateType(type, currentLanguage)}
                                    className="w-20 h-20 object-contain drop-shadow-md"
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                        {weaknesses.filter(w => w.multiplier > 2).length > 0 && (
                          <tr>
                            <td className="px-3 py-2.5 w-12 align-middle border-r border-[var(--color-border)]">
                              <span className="text-xs font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>×4</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex flex-wrap gap-1.5">
                                {weaknesses.filter(w => w.multiplier > 2).map(({ type }) => (
                                  <img
                                    key={type}
                                    src={getTypeSpriteUrl(type)}
                                    alt={translateType(type, currentLanguage)}
                                    title={translateType(type, currentLanguage)}
                                    className="w-20 h-20 object-contain drop-shadow-md"
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Base Stats */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('baseStats')}
                  </h3>
                  <span className="text-xs font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                    Total: {totalStats}
                  </span>
                </div>
                <div className="bg-[var(--color-card-alt)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {pokemon.stats.map((stat, i) => {
                        const pct = Math.min(100, (stat.base_stat / 255) * 100);
                        const barColor = BAR_COLORS[stat.stat.name] ?? 'bg-gray-400';
                        const textColor = TEXT_COLORS[stat.stat.name] ?? 'text-[var(--text-muted)]';

                        return (
                          <tr key={stat.stat.name} className={i < pokemon.stats.length - 1 ? 'border-b border-[var(--color-border)]' : ''}>
                            <td className="px-3 py-2 w-24 border-r border-[var(--color-border)]">
                              <span className={`text-[11px] font-bold ${textColor}`} style={{ fontFamily: 'var(--font-display)' }}>
                                {translateStatName(stat.stat.name, currentLanguage)}
                              </span>
                            </td>
                            <td className="px-3 py-2 w-10 text-right border-r border-[var(--color-border)]">
                              <span className="text-xs font-bold text-[var(--text-primary)] tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                                {stat.base_stat}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="h-2.5 bg-[var(--color-card)] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${barColor}`}
                                  style={{ width: `${pct}%`, animation: 'stat-fill 0.8s ease-out forwards' }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            {/* /right panel */}
            </div>
          {/* /grid */}
          </div>
          {/* /screen */}
          </div>

          {/* Bottom bezel */}
          <div className="flex items-center justify-center gap-1 px-3 py-1.5 mt-1">
            <div className="w-8 h-1.5 rounded-full bg-white/20" />
          </div>
        {/* /dex body */}
        </div>
      {/* /rotom frame */}
      </div>
      {/* /container */}
      </div>
    {/* /page */}
    </div>
  );
};

export default PokemonDetailPage;
