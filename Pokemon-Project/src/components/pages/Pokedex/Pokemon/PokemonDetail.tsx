import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePokemonSpecies } from '../../../../hooks/usePokemonSpecies';
import { ALL_TYPES, computeDefensiveMultiplier } from '../../../../lib/typeChart';
import { getTypeSpriteUrl, translateType, translateStatName } from '../utils';
import { fetchAbilityDescriptions, type AbilityMap } from '../ApiService';
import { navigate } from '../../../../navigation';
import { useSettings } from '../../../../context/SettingsContext';
import { useAuth } from '../../../../context/AuthContext';
import { useCollection } from '../../../../context/CollectionContext';

/* ── Types ──────────────────────────────────────────────────────────── */

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: { 'official-artwork': { front_default: string } };
  };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  abilities: Array<{ ability: { name: string; url: string }; is_hidden: boolean }>;
  height: number;
  weight: number;
}

/* ── Stat bar colors (matching PokemonStats.tsx) ────────────────────── */

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

  // Extract ID from URL: /pokemon/25 → 25
  const pokemonId = Number(window.location.pathname.split('/').pop());

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [abilityDescriptions, setAbilityDescriptions] = useState<AbilityMap>({});

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
  const sprite = pokemon
    ? pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
    : '';
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

  const primaryAbility = pokemon?.abilities.find(a => !a.is_hidden) ?? pokemon?.abilities[0];
  const abilityName =
    (primaryAbility && abilityDescriptions[primaryAbility.ability.name]?.name) ??
    primaryAbility?.ability.name.replace('-', ' ') ??
    '—';

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
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-slate-400 dark:from-gray-800 dark:to-gray-900 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 pt-16 sm:pt-10 max-w-4xl">

        {/* ── Navigation bar ────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          {/* Prev */}
          <button
            onClick={() => pokemonId > 1 && navigate(`/pokemon/${pokemonId - 1}`)}
            disabled={pokemonId <= 1}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
              pokemonId > 1
                ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                : 'text-gray-300 dark:text-gray-600 cursor-default'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">
              N.° {(pokemonId - 1).toString().padStart(4, '0')}
            </span>
          </button>

          {/* Back to Pokedex */}
          <button
            onClick={() => navigate('/pokedex')}
            className="text-sm font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer"
          >
            {t('profile_back')}
          </button>

          {/* Next */}
          <button
            onClick={() => navigate(`/pokemon/${pokemonId + 1}`)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">
              N.° {(pokemonId + 1).toString().padStart(4, '0')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Main card ─────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold capitalize text-gray-900 dark:text-white leading-tight">
                {pokemonName}
              </h1>
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
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
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
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
            <div className="relative flex flex-col items-center justify-center p-8 bg-slate-100/80 dark:bg-slate-800/40">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                <div className="w-48 h-48 border-8 border-slate-400 rounded-full" />
              </div>

              <img
                src={sprite}
                alt={pokemonName}
                className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-xl animate-float"
              />

              {/* Types below image */}
              <div className="flex gap-20 mt-4 relative z-10">
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
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {species?.description || t('detail_no_description')}
                  </p>
                )}
              </div>

              {/* Info table */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {t('height')}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {(pokemon.height / 10).toFixed(1)} {t('m')}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {t('detail_category')}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {speciesLoading ? (
                      <span className="inline-block w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      species?.genus || '—'
                    )}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {t('weight')}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {(pokemon.weight / 10).toFixed(1)} {t('kg')}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {t('detail_ability')}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">
                    {abilityName}
                  </p>
                </div>

                <div className="col-span-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {t('detail_gender')}
                  </p>
                  {speciesLoading ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ) : genderDisplay?.genderless ? (
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      {t('detail_genderless')}
                    </p>
                  ) : genderDisplay ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-blue-500">♂ {genderDisplay.male}%</span>
                      <span className="text-sm font-bold text-pink-500">♀ {genderDisplay.female}%</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t('detail_weaknesses')}
                </h3>
                {weaknesses.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">—</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {weaknesses.map(({ type, multiplier }) => (
                      <div key={type} className="relative">
                        <img
                          src={getTypeSpriteUrl(type)}
                          alt={translateType(type, currentLanguage)}
                          title={`${translateType(type, currentLanguage)} ×${multiplier}`}
                          className="w-20 h-20 object-contain drop-shadow-lg"
                        />
                        {multiplier > 2 && (
                          <span className="absolute -bottom-1 -right-1 text-[9px] font-black text-red-500 bg-white dark:bg-gray-900 rounded-full px-1">
                            ×{multiplier}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Base Stats */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('baseStats')}
                  </h3>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                    Total: {totalStats}
                  </span>
                </div>
                <div className="space-y-2">
                  {pokemon.stats.map(stat => {
                    const pct = Math.min(100, (stat.base_stat / 255) * 100);
                    const barColor = BAR_COLORS[stat.stat.name] ?? 'bg-gray-400';
                    const textColor = TEXT_COLORS[stat.stat.name] ?? 'text-gray-500';

                    return (
                      <div key={stat.stat.name} className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold w-16 shrink-0 ${textColor}`}>
                          {translateStatName(stat.stat.name, currentLanguage)}
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8 text-right tabular-nums shrink-0">
                          {stat.base_stat}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
