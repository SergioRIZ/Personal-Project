/**
 * Static map of base Pokémon ID → available Mega Evolution form names.
 * Form names match PokeAPI endpoints (e.g. `pokemon/charizard-mega-x`).
 */
export interface MegaForm {
  name: string;   // PokeAPI form name
  label: string;  // Display label (EN)
  labelEs: string; // Display label (ES)
}

export const MEGA_FORMS: Record<number, MegaForm[]> = {
  3:   [{ name: 'venusaur-mega',      label: 'Mega Venusaur',      labelEs: 'Mega Venusaur' }],
  6:   [{ name: 'charizard-mega-x',   label: 'Mega Charizard X',   labelEs: 'Mega Charizard X' }, { name: 'charizard-mega-y', label: 'Mega Charizard Y', labelEs: 'Mega Charizard Y' }],
  9:   [{ name: 'blastoise-mega',     label: 'Mega Blastoise',     labelEs: 'Mega Blastoise' }],
  15:  [{ name: 'beedrill-mega',      label: 'Mega Beedrill',      labelEs: 'Mega Beedrill' }],
  18:  [{ name: 'pidgeot-mega',       label: 'Mega Pidgeot',       labelEs: 'Mega Pidgeot' }],
  65:  [{ name: 'alakazam-mega',      label: 'Mega Alakazam',      labelEs: 'Mega Alakazam' }],
  80:  [{ name: 'slowbro-mega',       label: 'Mega Slowbro',       labelEs: 'Mega Slowbro' }],
  94:  [{ name: 'gengar-mega',        label: 'Mega Gengar',        labelEs: 'Mega Gengar' }],
  115: [{ name: 'kangaskhan-mega',    label: 'Mega Kangaskhan',    labelEs: 'Mega Kangaskhan' }],
  127: [{ name: 'pinsir-mega',        label: 'Mega Pinsir',        labelEs: 'Mega Pinsir' }],
  130: [{ name: 'gyarados-mega',      label: 'Mega Gyarados',      labelEs: 'Mega Gyarados' }],
  142: [{ name: 'aerodactyl-mega',    label: 'Mega Aerodactyl',    labelEs: 'Mega Aerodactyl' }],
  150: [{ name: 'mewtwo-mega-x',     label: 'Mega Mewtwo X',      labelEs: 'Mega Mewtwo X' }, { name: 'mewtwo-mega-y', label: 'Mega Mewtwo Y', labelEs: 'Mega Mewtwo Y' }],
  181: [{ name: 'ampharos-mega',      label: 'Mega Ampharos',      labelEs: 'Mega Ampharos' }],
  208: [{ name: 'steelix-mega',       label: 'Mega Steelix',       labelEs: 'Mega Steelix' }],
  212: [{ name: 'scizor-mega',        label: 'Mega Scizor',        labelEs: 'Mega Scizor' }],
  214: [{ name: 'heracross-mega',     label: 'Mega Heracross',     labelEs: 'Mega Heracross' }],
  229: [{ name: 'houndoom-mega',      label: 'Mega Houndoom',      labelEs: 'Mega Houndoom' }],
  248: [{ name: 'tyranitar-mega',     label: 'Mega Tyranitar',     labelEs: 'Mega Tyranitar' }],
  254: [{ name: 'sceptile-mega',      label: 'Mega Sceptile',      labelEs: 'Mega Sceptile' }],
  257: [{ name: 'blaziken-mega',      label: 'Mega Blaziken',      labelEs: 'Mega Blaziken' }],
  260: [{ name: 'swampert-mega',      label: 'Mega Swampert',      labelEs: 'Mega Swampert' }],
  282: [{ name: 'gardevoir-mega',     label: 'Mega Gardevoir',     labelEs: 'Mega Gardevoir' }],
  302: [{ name: 'sableye-mega',       label: 'Mega Sableye',       labelEs: 'Mega Sableye' }],
  303: [{ name: 'mawile-mega',        label: 'Mega Mawile',        labelEs: 'Mega Mawile' }],
  306: [{ name: 'aggron-mega',        label: 'Mega Aggron',        labelEs: 'Mega Aggron' }],
  308: [{ name: 'medicham-mega',      label: 'Mega Medicham',      labelEs: 'Mega Medicham' }],
  310: [{ name: 'manectric-mega',     label: 'Mega Manectric',     labelEs: 'Mega Manectric' }],
  319: [{ name: 'sharpedo-mega',      label: 'Mega Sharpedo',      labelEs: 'Mega Sharpedo' }],
  323: [{ name: 'camerupt-mega',      label: 'Mega Camerupt',      labelEs: 'Mega Camerupt' }],
  334: [{ name: 'altaria-mega',       label: 'Mega Altaria',       labelEs: 'Mega Altaria' }],
  354: [{ name: 'banette-mega',       label: 'Mega Banette',       labelEs: 'Mega Banette' }],
  359: [{ name: 'absol-mega',         label: 'Mega Absol',         labelEs: 'Mega Absol' }],
  362: [{ name: 'glalie-mega',        label: 'Mega Glalie',        labelEs: 'Mega Glalie' }],
  373: [{ name: 'salamence-mega',     label: 'Mega Salamence',     labelEs: 'Mega Salamence' }],
  376: [{ name: 'metagross-mega',     label: 'Mega Metagross',     labelEs: 'Mega Metagross' }],
  380: [{ name: 'latias-mega',        label: 'Mega Latias',        labelEs: 'Mega Latias' }],
  381: [{ name: 'latios-mega',        label: 'Mega Latios',        labelEs: 'Mega Latios' }],
  384: [{ name: 'rayquaza-mega',      label: 'Mega Rayquaza',      labelEs: 'Mega Rayquaza' }],
  428: [{ name: 'lopunny-mega',       label: 'Mega Lopunny',       labelEs: 'Mega Lopunny' }],
  445: [{ name: 'garchomp-mega',      label: 'Mega Garchomp',      labelEs: 'Mega Garchomp' }],
  448: [{ name: 'lucario-mega',       label: 'Mega Lucario',       labelEs: 'Mega Lucario' }],
  460: [{ name: 'abomasnow-mega',     label: 'Mega Abomasnow',     labelEs: 'Mega Abomasnow' }],
  475: [{ name: 'gallade-mega',       label: 'Mega Gallade',       labelEs: 'Mega Gallade' }],
  531: [{ name: 'audino-mega',        label: 'Mega Audino',        labelEs: 'Mega Audino' }],
  719: [{ name: 'diancie-mega',       label: 'Mega Diancie',       labelEs: 'Mega Diancie' }],
};

export function getMegaForms(pokemonId: number): MegaForm[] {
  return MEGA_FORMS[pokemonId] ?? [];
}
