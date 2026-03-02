import React from 'react';
import { useTranslation } from 'react-i18next';

const PokeBall = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="93" stroke="currentColor" strokeWidth="7" />
    <line x1="7" y1="100" x2="193" y2="100" stroke="currentColor" strokeWidth="7" />
    <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="7" />
    <circle cx="100" cy="100" r="11" fill="currentColor" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


interface HeroSectionProps {
  onExplore: () => void;
  totalPokemon: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, totalPokemon }) => {
  const { t } = useTranslation();

  const stats = [
    { value: totalPokemon > 0 ? totalPokemon.toLocaleString() : '1025', label: t('pokemon') },
    { value: '18', label: t('hero_stat_types') },
    { value: '9', label: t('hero_stat_gens') },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-200 via-teal-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-14 sm:pt-28 sm:pb-20">

      {/* Large Pokéball — top right */}
      <PokeBall className="absolute -right-[8%] -top-[12%] w-[30%] max-w-[480px] text-slate-700 dark:text-white opacity-[0.06] dark:opacity-[0.04] pointer-events-none select-none" />

      {/* Smaller Pokéball — bottom left */}
      <PokeBall className="absolute -left-[10%] -bottom-[18%] w-[40%] max-w-[340px] text-slate-700 dark:text-white opacity-[0.05] dark:opacity-[0.03] pointer-events-none select-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center gap-5 sm:gap-7">

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-slate-700 dark:from-green-400 dark:to-blue-400 drop-shadow-sm leading-tight tracking-tight">
          {t('hero_title')}
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 font-medium max-w-sm sm:max-w-md">
          {t('hero_tagline')}
        </p>

        {/* Stat chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/70 dark:bg-gray-700/60 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-white/60 dark:border-gray-600/60"
            >
              <span className="text-base sm:text-lg font-extrabold text-green-600 dark:text-green-400 tabular-nums">
                {value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 active:scale-95 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <SearchIcon />
            {t('hero_cta_explore')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
