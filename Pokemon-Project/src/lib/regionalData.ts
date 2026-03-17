/**
 * Static map of base Pokémon ID → available regional form names.
 * Form names match PokeAPI endpoints (e.g. `pokemon/rattata-alola`).
 */
export type RegionTag = 'alola' | 'galar' | 'hisui' | 'paldea';

export interface RegionalForm {
  name: string;      // PokeAPI form name
  label: string;     // Display label (EN)
  labelEs: string;   // Display label (ES)
  region: RegionTag;
}

export const REGIONAL_FORMS: Record<number, RegionalForm[]> = {
  // ── Alolan Forms (Gen 7) ──────────────────────────
  19:  [{ name: 'rattata-alola',    label: 'Alolan Rattata',    labelEs: 'Rattata de Alola',    region: 'alola' }],
  20:  [{ name: 'raticate-alola',   label: 'Alolan Raticate',   labelEs: 'Raticate de Alola',   region: 'alola' }],
  26:  [{ name: 'raichu-alola',     label: 'Alolan Raichu',     labelEs: 'Raichu de Alola',     region: 'alola' }],
  27:  [{ name: 'sandshrew-alola',  label: 'Alolan Sandshrew',  labelEs: 'Sandshrew de Alola',  region: 'alola' }],
  28:  [{ name: 'sandslash-alola',  label: 'Alolan Sandslash',  labelEs: 'Sandslash de Alola',  region: 'alola' }],
  37:  [{ name: 'vulpix-alola',     label: 'Alolan Vulpix',     labelEs: 'Vulpix de Alola',     region: 'alola' }],
  38:  [{ name: 'ninetales-alola',  label: 'Alolan Ninetales',  labelEs: 'Ninetales de Alola',  region: 'alola' }],
  50:  [{ name: 'diglett-alola',    label: 'Alolan Diglett',    labelEs: 'Diglett de Alola',    region: 'alola' }],
  51:  [{ name: 'dugtrio-alola',    label: 'Alolan Dugtrio',    labelEs: 'Dugtrio de Alola',    region: 'alola' }],
  52:  [
    { name: 'meowth-alola',  label: 'Alolan Meowth',   labelEs: 'Meowth de Alola',   region: 'alola' },
    { name: 'meowth-galar',  label: 'Galarian Meowth', labelEs: 'Meowth de Galar',   region: 'galar' },
  ],
  53:  [{ name: 'persian-alola',    label: 'Alolan Persian',    labelEs: 'Persian de Alola',    region: 'alola' }],
  74:  [{ name: 'geodude-alola',    label: 'Alolan Geodude',    labelEs: 'Geodude de Alola',    region: 'alola' }],
  75:  [{ name: 'graveler-alola',   label: 'Alolan Graveler',   labelEs: 'Graveler de Alola',   region: 'alola' }],
  76:  [{ name: 'golem-alola',      label: 'Alolan Golem',      labelEs: 'Golem de Alola',      region: 'alola' }],
  88:  [{ name: 'grimer-alola',     label: 'Alolan Grimer',     labelEs: 'Grimer de Alola',     region: 'alola' }],
  89:  [{ name: 'muk-alola',        label: 'Alolan Muk',        labelEs: 'Muk de Alola',        region: 'alola' }],
  103: [{ name: 'exeggutor-alola',  label: 'Alolan Exeggutor',  labelEs: 'Exeggutor de Alola',  region: 'alola' }],
  105: [{ name: 'marowak-alola',    label: 'Alolan Marowak',    labelEs: 'Marowak de Alola',    region: 'alola' }],

  // ── Galarian Forms (Gen 8) ────────────────────────
  77:  [{ name: 'ponyta-galar',     label: 'Galarian Ponyta',     labelEs: 'Ponyta de Galar',     region: 'galar' }],
  78:  [{ name: 'rapidash-galar',   label: 'Galarian Rapidash',   labelEs: 'Rapidash de Galar',   region: 'galar' }],
  79:  [{ name: 'slowpoke-galar',   label: 'Galarian Slowpoke',   labelEs: 'Slowpoke de Galar',   region: 'galar' }],
  80:  [{ name: 'slowbro-galar',    label: 'Galarian Slowbro',    labelEs: 'Slowbro de Galar',    region: 'galar' }],
  83:  [{ name: 'farfetchd-galar',  label: "Galarian Farfetch'd", labelEs: "Farfetch'd de Galar", region: 'galar' }],
  110: [{ name: 'weezing-galar',    label: 'Galarian Weezing',    labelEs: 'Weezing de Galar',    region: 'galar' }],
  122: [{ name: 'mr-mime-galar',    label: 'Galarian Mr. Mime',   labelEs: 'Mr. Mime de Galar',   region: 'galar' }],
  128: [
    { name: 'tauros-paldea-combat-breed', label: 'Paldean Tauros (Combat)', labelEs: 'Tauros de Paldea (Combate)', region: 'paldea' },
    { name: 'tauros-paldea-blaze-breed',  label: 'Paldean Tauros (Blaze)',  labelEs: 'Tauros de Paldea (Llama)',   region: 'paldea' },
    { name: 'tauros-paldea-aqua-breed',   label: 'Paldean Tauros (Aqua)',   labelEs: 'Tauros de Paldea (Agua)',    region: 'paldea' },
  ],
  144: [{ name: 'articuno-galar',   label: 'Galarian Articuno',   labelEs: 'Articuno de Galar',   region: 'galar' }],
  145: [{ name: 'zapdos-galar',     label: 'Galarian Zapdos',     labelEs: 'Zapdos de Galar',     region: 'galar' }],
  146: [{ name: 'moltres-galar',    label: 'Galarian Moltres',    labelEs: 'Moltres de Galar',    region: 'galar' }],
  194: [{ name: 'wooper-paldea',    label: 'Paldean Wooper',      labelEs: 'Wooper de Paldea',    region: 'paldea' }],
  199: [{ name: 'slowking-galar',   label: 'Galarian Slowking',   labelEs: 'Slowking de Galar',   region: 'galar' }],
  222: [{ name: 'corsola-galar',    label: 'Galarian Corsola',    labelEs: 'Corsola de Galar',    region: 'galar' }],
  263: [{ name: 'zigzagoon-galar',  label: 'Galarian Zigzagoon',  labelEs: 'Zigzagoon de Galar',  region: 'galar' }],
  264: [{ name: 'linoone-galar',    label: 'Galarian Linoone',    labelEs: 'Linoone de Galar',    region: 'galar' }],
  554: [{ name: 'darumaka-galar',   label: 'Galarian Darumaka',   labelEs: 'Darumaka de Galar',   region: 'galar' }],
  555: [{ name: 'darmanitan-galar-standard', label: 'Galarian Darmanitan', labelEs: 'Darmanitan de Galar', region: 'galar' }],
  562: [{ name: 'yamask-galar',     label: 'Galarian Yamask',     labelEs: 'Yamask de Galar',     region: 'galar' }],
  618: [{ name: 'stunfisk-galar',   label: 'Galarian Stunfisk',   labelEs: 'Stunfisk de Galar',   region: 'galar' }],

  // ── Hisuian Forms (Legends: Arceus) ───────────────
  58:  [{ name: 'growlithe-hisui',   label: 'Hisuian Growlithe',  labelEs: 'Growlithe de Hisui',  region: 'hisui' }],
  59:  [{ name: 'arcanine-hisui',    label: 'Hisuian Arcanine',   labelEs: 'Arcanine de Hisui',   region: 'hisui' }],
  100: [{ name: 'voltorb-hisui',     label: 'Hisuian Voltorb',    labelEs: 'Voltorb de Hisui',    region: 'hisui' }],
  101: [{ name: 'electrode-hisui',   label: 'Hisuian Electrode',  labelEs: 'Electrode de Hisui',  region: 'hisui' }],
  157: [{ name: 'typhlosion-hisui',  label: 'Hisuian Typhlosion', labelEs: 'Typhlosion de Hisui', region: 'hisui' }],
  211: [{ name: 'qwilfish-hisui',    label: 'Hisuian Qwilfish',   labelEs: 'Qwilfish de Hisui',   region: 'hisui' }],
  215: [{ name: 'sneasel-hisui',     label: 'Hisuian Sneasel',    labelEs: 'Sneasel de Hisui',    region: 'hisui' }],
  503: [{ name: 'samurott-hisui',    label: 'Hisuian Samurott',   labelEs: 'Samurott de Hisui',   region: 'hisui' }],
  549: [{ name: 'lilligant-hisui',   label: 'Hisuian Lilligant',  labelEs: 'Lilligant de Hisui',  region: 'hisui' }],
  570: [{ name: 'zorua-hisui',       label: 'Hisuian Zorua',      labelEs: 'Zorua de Hisui',      region: 'hisui' }],
  571: [{ name: 'zoroark-hisui',     label: 'Hisuian Zoroark',    labelEs: 'Zoroark de Hisui',    region: 'hisui' }],
  628: [{ name: 'braviary-hisui',    label: 'Hisuian Braviary',   labelEs: 'Braviary de Hisui',   region: 'hisui' }],
  705: [{ name: 'sliggoo-hisui',     label: 'Hisuian Sliggoo',    labelEs: 'Sliggoo de Hisui',    region: 'hisui' }],
  706: [{ name: 'goodra-hisui',      label: 'Hisuian Goodra',     labelEs: 'Goodra de Hisui',     region: 'hisui' }],
  713: [{ name: 'avalugg-hisui',     label: 'Hisuian Avalugg',    labelEs: 'Avalugg de Hisui',    region: 'hisui' }],
  724: [{ name: 'decidueye-hisui',   label: 'Hisuian Decidueye',  labelEs: 'Decidueye de Hisui',  region: 'hisui' }],
};

export function getRegionalForms(pokemonId: number): RegionalForm[] {
  return REGIONAL_FORMS[pokemonId] ?? [];
}
