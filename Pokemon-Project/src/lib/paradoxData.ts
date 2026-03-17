/**
 * Paradox Pokémon localized names.
 * These are separate species (not forms), but their English and Spanish names
 * are completely different, so we need a static map for search/display.
 */
export interface ParadoxEntry {
  nameEs: string;
  nameEn: string;
}

export const PARADOX_POKEMON: Record<number, ParadoxEntry> = {
  // ── Past Paradox (Scarlet) ────────────────────────
  984:  { nameEn: 'Great Tusk',    nameEs: 'Colmilargo' },
  985:  { nameEn: 'Scream Tail',   nameEs: 'Colagrito' },
  986:  { nameEn: 'Brute Bonnet',  nameEs: 'Furioseta' },
  987:  { nameEn: 'Flutter Mane',  nameEs: 'Melenaleteo' },
  988:  { nameEn: 'Slither Wing',  nameEs: 'Reptalada' },
  989:  { nameEn: 'Sandy Shocks',  nameEs: 'Arena Trepidante' },
  1005: { nameEn: 'Roaring Moon',  nameEs: 'Bramaluna' },
  1009: { nameEn: 'Walking Wake',  nameEs: 'Ondulagua' },
  1020: { nameEn: 'Gouging Fire',  nameEs: 'Flamardiente' },
  1021: { nameEn: 'Raging Bolt',   nameEs: 'Electrofuria' },

  // ── Future Paradox (Violet) ───────────────────────
  990:  { nameEn: 'Iron Treads',     nameEs: 'Ferrodada' },
  991:  { nameEn: 'Iron Bundle',     nameEs: 'Ferropalma' },
  992:  { nameEn: 'Iron Hands',      nameEs: 'Ferromanis' },
  993:  { nameEn: 'Iron Juggernaut', nameEs: 'Ferrocarro' },
  994:  { nameEn: 'Iron Moth',       nameEs: 'Ferropolilla' },
  995:  { nameEn: 'Iron Thorns',     nameEs: 'Ferropúas' },
  1006: { nameEn: 'Iron Valiant',    nameEs: 'Ferropaladín' },
  1010: { nameEn: 'Iron Leaves',     nameEs: 'Ferroverdor' },
  1022: { nameEn: 'Iron Boulder',    nameEs: 'Ferromole' },
  1023: { nameEn: 'Iron Crown',      nameEs: 'Ferrotesta' },
};
