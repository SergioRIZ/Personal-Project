import type { BaseStats } from '../hooks/usePokemonBaseStats';

export const NATURES = [
  ['Hardy',   null,  null  ], ['Lonely',  'atk', 'def'],
  ['Brave',   'atk', 'spe'], ['Adamant', 'atk', 'spa'],
  ['Naughty', 'atk', 'spd'], ['Bold',    'def', 'atk'],
  ['Docile',  null,  null  ], ['Relaxed', 'def', 'spe'],
  ['Impish',  'def', 'spa'], ['Lax',     'def', 'spd'],
  ['Timid',   'spe', 'atk'], ['Hasty',   'spe', 'def'],
  ['Serious', null,  null  ], ['Jolly',   'spe', 'spa'],
  ['Naive',   'spe', 'spd'], ['Modest',  'spa', 'atk'],
  ['Mild',    'spa', 'def'], ['Quiet',   'spa', 'spe'],
  ['Bashful', null,  null  ], ['Rash',    'spa', 'spd'],
  ['Calm',    'spd', 'atk'], ['Gentle',  'spd', 'def'],
  ['Sassy',   'spd', 'spe'], ['Careful', 'spd', 'spa'],
  ['Quirky',  null,  null  ],
] as const;

const NATURE_TRANSLATIONS: Record<string, Record<string, string>> = {
  Hardy:   { es: 'Fuerte' },
  Lonely:  { es: 'Huraña' },
  Brave:   { es: 'Audaz' },
  Adamant: { es: 'Firme' },
  Naughty: { es: 'Pícara' },
  Bold:    { es: 'Osada' },
  Docile:  { es: 'Dócil' },
  Relaxed: { es: 'Plácida' },
  Impish:  { es: 'Agitada' },
  Lax:     { es: 'Floja' },
  Timid:   { es: 'Miedosa' },
  Hasty:   { es: 'Activa' },
  Serious: { es: 'Seria' },
  Jolly:   { es: 'Alegre' },
  Naive:   { es: 'Ingenua' },
  Modest:  { es: 'Modesta' },
  Mild:    { es: 'Afable' },
  Quiet:   { es: 'Mansa' },
  Bashful: { es: 'Tímida' },
  Rash:    { es: 'Alocada' },
  Calm:    { es: 'Serena' },
  Gentle:  { es: 'Amable' },
  Sassy:   { es: 'Grosera' },
  Careful: { es: 'Cauta' },
  Quirky:  { es: 'Rara' },
};

export function translateNature(name: string, lang: string): string {
  if (lang === 'en') return name;
  return NATURE_TRANSLATIONS[name]?.[lang] ?? name;
}

export function getNatureModifiers(nature: string | null): Record<keyof BaseStats, number> {
  const mods: Record<keyof BaseStats, number> = { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };
  if (!nature) return mods;
  const nat = NATURES.find(([n]) => n === nature);
  if (nat?.[1]) {
    mods[nat[1] as keyof BaseStats] = 1.1;
    mods[nat[2] as keyof BaseStats] = 0.9;
  }
  return mods;
}
