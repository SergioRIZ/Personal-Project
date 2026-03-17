/**
 * Static map of base Pokémon ID → Gigantamax form names.
 * Form names match PokeAPI endpoints (e.g. `pokemon/charizard-gmax`).
 */
export interface GmaxForm {
  name: string;   // PokeAPI form name
  label: string;  // Display label (EN)
  labelEs: string; // Display label (ES)
}

export const GMAX_FORMS: Record<number, GmaxForm[]> = {
  // Gen 1
  3:   [{ name: 'venusaur-gmax',     label: 'Gigantamax Venusaur',    labelEs: 'Venusaur Gigamax' }],
  6:   [{ name: 'charizard-gmax',    label: 'Gigantamax Charizard',   labelEs: 'Charizard Gigamax' }],
  9:   [{ name: 'blastoise-gmax',    label: 'Gigantamax Blastoise',   labelEs: 'Blastoise Gigamax' }],
  12:  [{ name: 'butterfree-gmax',   label: 'Gigantamax Butterfree',  labelEs: 'Butterfree Gigamax' }],
  25:  [{ name: 'pikachu-gmax',      label: 'Gigantamax Pikachu',     labelEs: 'Pikachu Gigamax' }],
  52:  [{ name: 'meowth-gmax',       label: 'Gigantamax Meowth',      labelEs: 'Meowth Gigamax' }],
  68:  [{ name: 'machamp-gmax',      label: 'Gigantamax Machamp',     labelEs: 'Machamp Gigamax' }],
  94:  [{ name: 'gengar-gmax',       label: 'Gigantamax Gengar',      labelEs: 'Gengar Gigamax' }],
  99:  [{ name: 'kingler-gmax',      label: 'Gigantamax Kingler',     labelEs: 'Kingler Gigamax' }],
  131: [{ name: 'lapras-gmax',       label: 'Gigantamax Lapras',      labelEs: 'Lapras Gigamax' }],
  133: [{ name: 'eevee-gmax',        label: 'Gigantamax Eevee',       labelEs: 'Eevee Gigamax' }],
  143: [{ name: 'snorlax-gmax',      label: 'Gigantamax Snorlax',     labelEs: 'Snorlax Gigamax' }],
  // Gen 5
  569: [{ name: 'garbodor-gmax',     label: 'Gigantamax Garbodor',    labelEs: 'Garbodor Gigamax' }],
  // Gen 7
  809: [{ name: 'melmetal-gmax',     label: 'Gigantamax Melmetal',    labelEs: 'Melmetal Gigamax' }],
  // Gen 8
  812: [{ name: 'rillaboom-gmax',    label: 'Gigantamax Rillaboom',   labelEs: 'Rillaboom Gigamax' }],
  815: [{ name: 'cinderace-gmax',    label: 'Gigantamax Cinderace',   labelEs: 'Cinderace Gigamax' }],
  818: [{ name: 'inteleon-gmax',     label: 'Gigantamax Inteleon',    labelEs: 'Inteleon Gigamax' }],
  823: [{ name: 'corviknight-gmax',  label: 'Gigantamax Corviknight', labelEs: 'Corviknight Gigamax' }],
  826: [{ name: 'orbeetle-gmax',     label: 'Gigantamax Orbeetle',    labelEs: 'Orbeetle Gigamax' }],
  834: [{ name: 'drednaw-gmax',      label: 'Gigantamax Drednaw',     labelEs: 'Drednaw Gigamax' }],
  839: [{ name: 'coalossal-gmax',    label: 'Gigantamax Coalossal',   labelEs: 'Coalossal Gigamax' }],
  841: [{ name: 'flapple-gmax',      label: 'Gigantamax Flapple',     labelEs: 'Flapple Gigamax' }],
  842: [{ name: 'appletun-gmax',     label: 'Gigantamax Appletun',    labelEs: 'Appletun Gigamax' }],
  844: [{ name: 'sandaconda-gmax',   label: 'Gigantamax Sandaconda',  labelEs: 'Sandaconda Gigamax' }],
  849: [
    { name: 'toxtricity-amped-gmax',   label: 'Gigantamax Toxtricity (Amped)',   labelEs: 'Toxtricity Gigamax (Agudo)' },
    { name: 'toxtricity-low-key-gmax',  label: 'Gigantamax Toxtricity (Low Key)', labelEs: 'Toxtricity Gigamax (Grave)' },
  ],
  851: [{ name: 'centiskorch-gmax',  label: 'Gigantamax Centiskorch', labelEs: 'Centiskorch Gigamax' }],
  858: [{ name: 'hatterene-gmax',    label: 'Gigantamax Hatterene',   labelEs: 'Hatterene Gigamax' }],
  861: [{ name: 'grimmsnarl-gmax',   label: 'Gigantamax Grimmsnarl',  labelEs: 'Grimmsnarl Gigamax' }],
  869: [{ name: 'alcremie-gmax',     label: 'Gigantamax Alcremie',    labelEs: 'Alcremie Gigamax' }],
  879: [{ name: 'copperajah-gmax',   label: 'Gigantamax Copperajah',  labelEs: 'Copperajah Gigamax' }],
  884: [{ name: 'duraludon-gmax',    label: 'Gigantamax Duraludon',   labelEs: 'Duraludon Gigamax' }],
  892: [
    { name: 'urshifu-single-strike-gmax', label: 'Gigantamax Urshifu (Single)', labelEs: 'Urshifu Gigamax (Brusco)' },
    { name: 'urshifu-rapid-strike-gmax',  label: 'Gigantamax Urshifu (Rapid)',  labelEs: 'Urshifu Gigamax (Fluido)' },
  ],
};

export function getGmaxForms(pokemonId: number): GmaxForm[] {
  return GMAX_FORMS[pokemonId] ?? [];
}
