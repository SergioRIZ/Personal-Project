type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: 'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-500 shadow-inner',
  fire: 'bg-gradient-to-r from-red-500 to-orange-500 border-red-600 shadow-inner',
  water: 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-600 shadow-inner',
  electric: 'bg-gradient-to-r from-yellow-400 to-amber-400 border-yellow-500 shadow-inner',
  grass: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-600 shadow-inner',
  ice: 'bg-gradient-to-r from-blue-200 to-cyan-300 border-blue-300 shadow-inner',
  fighting: 'bg-gradient-to-r from-red-700 to-red-800 border-red-800 shadow-inner',
  poison: 'bg-gradient-to-r from-purple-500 to-violet-500 border-purple-600 shadow-inner',
  ground: 'bg-gradient-to-r from-yellow-700 to-amber-700 border-yellow-800 shadow-inner',
  flying: 'bg-gradient-to-r from-indigo-300 to-sky-300 border-indigo-400 shadow-inner',
  psychic: 'bg-gradient-to-r from-pink-500 to-fuchsia-500 border-pink-600 shadow-inner',
  bug: 'bg-gradient-to-r from-green-600 to-lime-600 border-green-700 shadow-inner',
  rock: 'bg-gradient-to-r from-yellow-800 to-amber-800 border-yellow-900 shadow-inner',
  ghost: 'bg-gradient-to-r from-purple-700 to-violet-700 border-purple-800 shadow-inner',
  dragon: 'bg-gradient-to-r from-indigo-700 to-blue-700 border-indigo-800 shadow-inner',
  dark: 'bg-gradient-to-r from-gray-800 to-slate-800 border-gray-900 shadow-inner',
  steel: 'bg-gradient-to-r from-gray-500 to-slate-500 border-gray-600 shadow-inner',
  fairy: 'bg-gradient-to-r from-pink-300 to-rose-300 border-pink-400 shadow-inner',
};

export const getTypeColor = (type: string): string =>
  TYPE_COLORS[type as PokemonType] ??
  'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-500 shadow-inner';

const STAT_COLORS: Record<string, string> = {
  'hp': 'bg-gradient-to-r from-rose-500 to-rose-600',
  'attack': 'bg-gradient-to-r from-orange-500 to-orange-600',
  'defense': 'bg-gradient-to-r from-amber-500 to-amber-600',
  'special-attack': 'bg-gradient-to-r from-blue-500 to-indigo-600',
  'special-defense': 'bg-gradient-to-r from-emerald-500 to-green-600',
  'speed': 'bg-gradient-to-r from-purple-500 to-violet-600',
};

export const getStatColor = (statName: string): string =>
  STAT_COLORS[statName] ?? 'bg-gradient-to-r from-gray-500 to-gray-600';

const STAT_TRANSLATIONS: Record<string, Record<string, string>> = {
  'hp': { es: 'HP', en: 'HP' },
  'attack': { es: 'Ataque', en: 'Attack' },
  'defense': { es: 'Defensa', en: 'Defense' },
  'special-attack': { es: 'Ataque Esp.', en: 'Sp. Attack' },
  'special-defense': { es: 'Defensa Esp.', en: 'Sp. Defense' },
  'speed': { es: 'Velocidad', en: 'Speed' },
};

export const translateStatName = (statName: string, currentLanguage: string): string =>
  STAT_TRANSLATIONS[statName]?.[currentLanguage] ?? statName.replace('-', ' ');

const TYPE_TRANSLATIONS: Record<string, Record<string, string>> = {
  normal: { es: 'normal', en: 'normal' },
  fire: { es: 'fuego', en: 'fire' },
  water: { es: 'agua', en: 'water' },
  electric: { es: 'eléctrico', en: 'electric' },
  grass: { es: 'planta', en: 'grass' },
  ice: { es: 'hielo', en: 'ice' },
  fighting: { es: 'lucha', en: 'fighting' },
  poison: { es: 'veneno', en: 'poison' },
  ground: { es: 'tierra', en: 'ground' },
  flying: { es: 'volador', en: 'flying' },
  psychic: { es: 'psíquico', en: 'psychic' },
  bug: { es: 'bicho', en: 'bug' },
  rock: { es: 'roca', en: 'rock' },
  ghost: { es: 'fantasma', en: 'ghost' },
  dragon: { es: 'dragón', en: 'dragon' },
  dark: { es: 'siniestro', en: 'dark' },
  steel: { es: 'acero', en: 'steel' },
  fairy: { es: 'hada', en: 'fairy' },
};

export const translateType = (type: string, currentLanguage: string): string =>
  TYPE_TRANSLATIONS[type]?.[currentLanguage] ?? type;
