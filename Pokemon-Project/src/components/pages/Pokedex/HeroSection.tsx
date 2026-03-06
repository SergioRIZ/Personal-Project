import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../Link';
import { useSettings } from '../../../context/SettingsContext';

/* ── type colours for floating particles ─────────────────────────── */
const TYPE_COLORS = [
  '#F08030', '#6890F0', '#F8D030', '#78C850', '#98D8D8',
  '#C03028', '#A040A0', '#A890F0', '#F85888', '#A8B820',
  '#7038F8', '#B8B8D0', '#EE99AC', '#E0C068', '#705898',
];

/* ── deterministic particles ─────────────────────────────────────── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  color: TYPE_COLORS[i % TYPE_COLORS.length],
  size: 4 + (i % 5) * 2,
  left: ((i * 5.7 + 3) % 100),
  top: ((i * 7.3 + 8) % 100),
  delay: (i * 1.3) % 8,
  duration: 14 + (i % 6) * 3,
  opacity: 0.15 + (i % 4) * 0.06,
}));

/* ── sprite URL helper ───────────────────────────────────────────── */
const SPRITE = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/* ── themed floating Pokemon ─────────────────────────────────────── */
interface Sprite { id: number; left: string; top: string; size: number; delay: number; duration: number; flip: boolean }

const LIGHT_POKEMON: Sprite[] = [
  { id: 6,   left: '3%',  top: '4%',   size: 130, delay: 0,   duration: 14, flip: false },  // Charizard
  { id: 25,  left: '18%', top: '14%',  size: 85,  delay: 1.5, duration: 16, flip: false },  // Pikachu
  { id: 150, left: '2%',  top: '46%',  size: 110, delay: 0.8, duration: 13, flip: false },  // Mewtwo
  { id: 249, left: '12%', top: '82%',  size: 125, delay: 2.2, duration: 15, flip: false },  // Lugia
  { id: 384, left: '82%', top: '2%',   size: 130, delay: 1,   duration: 15, flip: true  },  // Rayquaza
  { id: 448, left: '70%', top: '13%',  size: 90,  delay: 2.5, duration: 12, flip: true  },  // Lucario
  { id: 130, left: '88%', top: '50%',  size: 120, delay: 0.5, duration: 17, flip: true  },  // Gyarados
  { id: 149, left: '76%', top: '84%',  size: 105, delay: 3,   duration: 14, flip: true  },  // Dragonite
  { id: 250, left: '44%', top: '2%',   size: 115, delay: 1.8, duration: 15, flip: false },  // Ho-Oh
  { id: 282, left: '5%',  top: '66%',  size: 95,  delay: 3.5, duration: 13, flip: false },  // Gardevoir
  { id: 445, left: '85%', top: '70%',  size: 100, delay: 2.8, duration: 16, flip: true  },  // Garchomp
  { id: 643, left: '48%', top: '88%',  size: 120, delay: 0.3, duration: 14, flip: true  },  // Reshiram
  { id: 385, left: '20%', top: '42%',  size: 90,  delay: 2,   duration: 15, flip: false },  // Jirachi
  { id: 493, left: '32%', top: '86%',  size: 110, delay: 3.2, duration: 16, flip: false },  // Arceus
];

const DARK_POKEMON: Sprite[] = [
  { id: 491, left: '4%',  top: '3%',   size: 115, delay: 0,   duration: 14, flip: false },  // Darkrai
  { id: 197, left: '20%', top: '16%',  size: 80,  delay: 1.5, duration: 16, flip: false },  // Umbreon
  { id: 792, left: '1%',  top: '44%',  size: 120, delay: 0.8, duration: 13, flip: false },  // Lunala
  { id: 359, left: '14%', top: '80%',  size: 105, delay: 2.2, duration: 15, flip: false },  // Absol
  { id: 430, left: '80%', top: '4%',   size: 100, delay: 1,   duration: 15, flip: true  },  // Honchkrow
  { id: 94,  left: '68%', top: '15%',  size: 100, delay: 2.5, duration: 12, flip: true  },  // Gengar
  { id: 571, left: '86%', top: '48%',  size: 110, delay: 0.5, duration: 17, flip: true  },  // Zoroark
  { id: 229, left: '74%', top: '83%',  size: 105, delay: 3,   duration: 14, flip: true  },  // Houndoom
  { id: 248, left: '46%', top: '1%',   size: 120, delay: 1.8, duration: 15, flip: false },  // Tyranitar
  { id: 461, left: '6%',  top: '65%',  size: 90,  delay: 3.5, duration: 13, flip: false },  // Weavile
  { id: 609, left: '84%', top: '68%',  size: 95,  delay: 2.8, duration: 16, flip: true  },  // Chandelure
  { id: 861, left: '50%', top: '87%',  size: 110, delay: 0.3, duration: 14, flip: true  },  // Grimmsnarl
  { id: 635, left: '75%', top: '41%',  size: 100, delay: 1.2, duration: 14, flip: true  },  // Hydreigon
  { id: 625, left: '33%', top: '85%',  size: 95,  delay: 3.2, duration: 16, flip: false },  // Bisharp
];

/* ── count-up hook ───────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf = 0;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return count;
}

/* ── sub-components ──────────────────────────────────────────────── */
const PokeBall = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden="true">
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

/* ── feature-card icons ──────────────────────────────────────────── */
const PokedexCardIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const TeamsCardIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.06a1.5 1.5 0 010-2.58l5.1-3.06a1.5 1.5 0 011.5 0l5.1 3.06a1.5 1.5 0 010 2.58l-5.1 3.06a1.5 1.5 0 01-1.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v6.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 9v5.25a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V9" />
  </svg>
);
const CollectionCardIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

/* ── keyframes ───────────────────────────────────────────────────── */
const HERO_STYLES = `
  @keyframes hero-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-25px) rotate(8deg); }
  }
  @keyframes hero-float-rev {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(20px) rotate(-6deg); }
  }
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hero-particle {
    0%, 100% { transform: translate(0, 0)       scale(1);   }
    25%      { transform: translate(18px, -35px) scale(1.3); }
    50%      { transform: translate(-12px,-12px) scale(0.7); }
    75%      { transform: translate(22px, -45px) scale(1.15); }
  }
  @keyframes hero-sprite-drift {
    0%, 100% { transform: translateY(0);    }
    50%      { transform: translateY(-18px); }
  }
  @keyframes hero-bg-shift {
    0%, 100% { background-position: 0% 50%;   }
    50%      { background-position: 100% 50%; }
  }
  @keyframes hero-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes hero-glow {
    0%, 100% { box-shadow: 0 4px 15px rgba(220,38,38,.25), 0 0 30px rgba(245,158,11,.10); }
    50%      { box-shadow: 0 4px 30px rgba(220,38,38,.45), 0 0 60px rgba(245,158,11,.20); }
  }
  @keyframes hero-card-glow {
    0%, 100% { box-shadow: 0 0 0 rgba(220,38,38,0); }
    50%      { box-shadow: 0 0 20px rgba(220,38,38,.06); }
  }

  .hero-s1 { animation: hero-fade-up .8s ease-out .1s both; }
  .hero-s2 { animation: hero-fade-up .8s ease-out .3s both; }
  .hero-s3 { animation: hero-fade-up .8s ease-out .5s both; }
  .hero-s4 { animation: hero-fade-up .8s ease-out .7s both; }
  .hero-s5 { animation: hero-fade-up .8s ease-out .9s both; }

  .hero-title-shimmer {
    background: linear-gradient(90deg, #DC2626, #F59E0B, #06B6D4, #DC2626);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: hero-shimmer 4s linear infinite;
  }
  :is(.dark) .hero-title-shimmer {
    background: linear-gradient(90deg, #EF4444, #FBBF24, #22D3EE, #EF4444);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

/* ── component ───────────────────────────────────────────────────── */
interface HeroSectionProps {
  onExplore: () => void;
  totalPokemon: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, totalPokemon }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const pokemonCount = useCountUp(totalPokemon > 0 ? totalPokemon : 1025, 2000, 600);
  const typesCount = useCountUp(18, 1200, 800);
  const gensCount = useCountUp(9, 1000, 1000);

  const stats = [
    { value: pokemonCount.toLocaleString(), label: t('pokemon') },
    { value: String(typesCount), label: t('hero_stat_types') },
    { value: String(gensCount), label: t('hero_stat_gens') },
  ];

  const features = [
    { icon: <PokedexCardIcon />, title: 'Pokédex',                      desc: t('hero_feat_pokedex'),    to: '/pokedex' },
    { icon: <TeamsCardIcon />,   title: t('teams'),                      desc: t('hero_feat_teams'),      to: '/teams' },
    { icon: <CollectionCardIcon />, title: t('profile_collection_title'), desc: t('hero_feat_collection'), to: '/profile' },
  ];

  const sprites = settings.darkMode ? DARK_POKEMON : LIGHT_POKEMON;

  return (
    <>
      <style>{HERO_STYLES}</style>

      <section
        className="relative overflow-hidden min-h-screen flex flex-col justify-center"
        style={{
          background: settings.darkMode
            ? 'linear-gradient(135deg, #0C1222, #1A2332, #0C1222)'
            : 'linear-gradient(-45deg, #FEE2E2, #FEF3C7, #CFFAFE, #FFF8F0, #FEE2E2)',
          backgroundSize: settings.darkMode ? '100% 100%' : '400% 400%',
          animation: settings.darkMode ? 'none' : 'hero-bg-shift 15s ease infinite',
        }}
      >
        {/* ── geometric grid overlay ───────────────────────── */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* ── floating particles (sm+) ──────────────────────── */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[1px] pointer-events-none select-none hidden sm:block"
            style={{
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              opacity: p.opacity,
              animation: `hero-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        {/* ── themed Pokemon sprites (lg+) ─────────────────── */}
        {sprites.map((poke) => (
          <img
            key={poke.id}
            src={SPRITE(poke.id)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
            className="absolute pointer-events-none select-none hidden lg:block drop-shadow-lg"
            style={{
              left: poke.left,
              top: poke.top,
              width: poke.size,
              height: poke.size,
              objectFit: 'contain',
              opacity: settings.darkMode ? 0.1 : 0.14,
              transform: poke.flip ? 'scaleX(-1)' : undefined,
              animation: `hero-sprite-drift ${poke.duration}s ease-in-out ${poke.delay}s infinite`,
              filter: settings.darkMode ? 'saturate(0.5) brightness(1.3)' : 'saturate(0.7)',
            }}
          />
        ))}

        {/* ── floating Pokeballs ────────────────────────────── */}
        <PokeBall
          className="absolute -right-[8%] -top-[12%] w-[30%] max-w-[480px] opacity-[0.06] pointer-events-none select-none"
          style={{ color: 'var(--color-primary)', animation: 'hero-float 8s ease-in-out infinite' }}
        />
        <PokeBall
          className="absolute -left-[10%] -bottom-[18%] w-[40%] max-w-[340px] opacity-[0.05] pointer-events-none select-none"
          style={{ color: 'var(--color-accent)', animation: 'hero-float-rev 10s ease-in-out 1s infinite' }}
        />

        {/* ── content (vertically centred) ─────────────────── */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center gap-5 sm:gap-7 py-20 sm:py-0">

          {/* Title */}
          <h1
            className="hero-s1 hero-title-shimmer text-4xl sm:text-6xl md:text-8xl font-extrabold leading-tight tracking-tighter"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('hero_title')}
          </h1>

          {/* Tagline */}
          <p className="hero-s2 text-base sm:text-xl text-[var(--text-secondary)] font-medium max-w-sm sm:max-w-md">
            {t('hero_tagline')}
          </p>

          {/* Stat chips */}
          <div className="hero-s3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-[var(--color-card)]/70 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-[var(--color-border)]"
              >
                <span
                  className="text-base sm:text-lg font-extrabold text-[var(--color-primary)] tabular-nums"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hero-s4 flex flex-wrap items-center justify-center gap-3 mt-1">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-lg"
              style={{ fontFamily: 'var(--font-display)', animation: 'hero-glow 3s ease-in-out 1.5s infinite' }}
            >
              <SearchIcon />
              {t('hero_cta_explore')}
            </button>
          </div>

          {/* Feature cards */}
          <div className="hero-s5 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full max-w-3xl">
            {features.map(({ icon, title, desc, to }) => (
              <Link
                key={to}
                to={to}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--color-card)]/60 backdrop-blur-md border border-[var(--color-border)] shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                style={{ animation: 'hero-card-glow 4s ease-in-out infinite' }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-200">
                  {icon}
                </div>
                <span className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {title}
                </span>
                <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
