/**
 * Static map of base Pokémon ID → available Mega Evolution form names.
 * Form names match PokeAPI endpoints (e.g. `pokemon/charizard-mega-x`).
 */
export interface MegaForm {
  name: string;   // PokeAPI form name
  label: string;  // Display label
}

export const MEGA_FORMS: Record<number, MegaForm[]> = {
  3:   [{ name: 'venusaur-mega',      label: 'Mega Venusaur' }],
  6:   [{ name: 'charizard-mega-x',   label: 'Mega Charizard X' }, { name: 'charizard-mega-y', label: 'Mega Charizard Y' }],
  9:   [{ name: 'blastoise-mega',     label: 'Mega Blastoise' }],
  15:  [{ name: 'beedrill-mega',      label: 'Mega Beedrill' }],
  18:  [{ name: 'pidgeot-mega',       label: 'Mega Pidgeot' }],
  65:  [{ name: 'alakazam-mega',      label: 'Mega Alakazam' }],
  80:  [{ name: 'slowbro-mega',       label: 'Mega Slowbro' }],
  94:  [{ name: 'gengar-mega',        label: 'Mega Gengar' }],
  115: [{ name: 'kangaskhan-mega',    label: 'Mega Kangaskhan' }],
  127: [{ name: 'pinsir-mega',        label: 'Mega Pinsir' }],
  130: [{ name: 'gyarados-mega',      label: 'Mega Gyarados' }],
  142: [{ name: 'aerodactyl-mega',    label: 'Mega Aerodactyl' }],
  150: [{ name: 'mewtwo-mega-x',     label: 'Mega Mewtwo X' }, { name: 'mewtwo-mega-y', label: 'Mega Mewtwo Y' }],
  181: [{ name: 'ampharos-mega',      label: 'Mega Ampharos' }],
  208: [{ name: 'steelix-mega',       label: 'Mega Steelix' }],
  212: [{ name: 'scizor-mega',        label: 'Mega Scizor' }],
  214: [{ name: 'heracross-mega',     label: 'Mega Heracross' }],
  229: [{ name: 'houndoom-mega',      label: 'Mega Houndoom' }],
  248: [{ name: 'tyranitar-mega',     label: 'Mega Tyranitar' }],
  254: [{ name: 'sceptile-mega',      label: 'Mega Sceptile' }],
  257: [{ name: 'blaziken-mega',      label: 'Mega Blaziken' }],
  260: [{ name: 'swampert-mega',      label: 'Mega Swampert' }],
  282: [{ name: 'gardevoir-mega',     label: 'Mega Gardevoir' }],
  302: [{ name: 'sableye-mega',       label: 'Mega Sableye' }],
  303: [{ name: 'mawile-mega',        label: 'Mega Mawile' }],
  306: [{ name: 'aggron-mega',        label: 'Mega Aggron' }],
  308: [{ name: 'medicham-mega',      label: 'Mega Medicham' }],
  310: [{ name: 'manectric-mega',     label: 'Mega Manectric' }],
  319: [{ name: 'sharpedo-mega',      label: 'Mega Sharpedo' }],
  323: [{ name: 'camerupt-mega',      label: 'Mega Camerupt' }],
  334: [{ name: 'altaria-mega',       label: 'Mega Altaria' }],
  354: [{ name: 'banette-mega',       label: 'Mega Banette' }],
  359: [{ name: 'absol-mega',         label: 'Mega Absol' }],
  362: [{ name: 'glalie-mega',        label: 'Mega Glalie' }],
  373: [{ name: 'salamence-mega',     label: 'Mega Salamence' }],
  376: [{ name: 'metagross-mega',     label: 'Mega Metagross' }],
  380: [{ name: 'latias-mega',        label: 'Mega Latias' }],
  381: [{ name: 'latios-mega',        label: 'Mega Latios' }],
  384: [{ name: 'rayquaza-mega',      label: 'Mega Rayquaza' }],
  428: [{ name: 'lopunny-mega',       label: 'Mega Lopunny' }],
  445: [{ name: 'garchomp-mega',      label: 'Mega Garchomp' }],
  448: [{ name: 'lucario-mega',       label: 'Mega Lucario' }],
  460: [{ name: 'abomasnow-mega',     label: 'Mega Abomasnow' }],
  475: [{ name: 'gallade-mega',       label: 'Mega Gallade' }],
  531: [{ name: 'audino-mega',        label: 'Mega Audino' }],
  719: [{ name: 'diancie-mega',       label: 'Mega Diancie' }],
};

export function getMegaForms(pokemonId: number): MegaForm[] {
  return MEGA_FORMS[pokemonId] ?? [];
}
