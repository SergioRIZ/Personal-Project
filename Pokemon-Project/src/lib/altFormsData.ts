/**
 * Alternate forms with different stats, types, or abilities.
 * Only battle-relevant forms (not cosmetic variations).
 * Form names match PokeAPI endpoints.
 */
export interface AltForm {
  name: string;      // PokeAPI form name
  label: string;     // Display label (EN)
  labelEs: string;   // Display label (ES)
}

export const ALT_FORMS: Record<number, AltForm[]> = {
  // ── Gen 3 ─────────────────────────────────────────
  // Deoxys (#386) — 4 forms with very different stats
  386: [
    { name: 'deoxys-attack',  label: 'Deoxys (Attack)',  labelEs: 'Deoxys (Ataque)' },
    { name: 'deoxys-defense', label: 'Deoxys (Defense)', labelEs: 'Deoxys (Defensa)' },
    { name: 'deoxys-speed',   label: 'Deoxys (Speed)',   labelEs: 'Deoxys (Velocidad)' },
  ],

  // ── Gen 4 ─────────────────────────────────────────
  // Wormadam (#413) — different types
  413: [
    { name: 'wormadam-sandy', label: 'Wormadam (Sandy)', labelEs: 'Wormadam (Arena)' },
    { name: 'wormadam-trash', label: 'Wormadam (Trash)', labelEs: 'Wormadam (Basura)' },
  ],
  // Rotom (#479) — different types
  479: [
    { name: 'rotom-heat',  label: 'Rotom (Heat)',  labelEs: 'Rotom (Calor)' },
    { name: 'rotom-wash',  label: 'Rotom (Wash)',  labelEs: 'Rotom (Lavado)' },
    { name: 'rotom-frost', label: 'Rotom (Frost)', labelEs: 'Rotom (Frío)' },
    { name: 'rotom-fan',   label: 'Rotom (Fan)',   labelEs: 'Rotom (Ventilador)' },
    { name: 'rotom-mow',   label: 'Rotom (Mow)',   labelEs: 'Rotom (Corte)' },
  ],
  // Giratina (#487) — different stats/ability
  487: [
    { name: 'giratina-origin', label: 'Giratina (Origin)', labelEs: 'Giratina (Origen)' },
  ],
  // Shaymin (#492) — different types and stats
  492: [
    { name: 'shaymin-sky', label: 'Shaymin (Sky)', labelEs: 'Shaymin (Cielo)' },
  ],

  // ── Gen 5 ─────────────────────────────────────────
  // Basculin (#550) — White-Striped has different ability
  550: [
    { name: 'basculin-blue-striped',  label: 'Basculin (Blue)',  labelEs: 'Basculin (Azul)' },
    { name: 'basculin-white-striped', label: 'Basculin (White)', labelEs: 'Basculin (Blanco)' },
  ],
  // Darmanitan (#555) — Zen Mode different types/stats
  555: [
    { name: 'darmanitan-zen',                label: 'Darmanitan (Zen)',         labelEs: 'Darmanitan (Zen)' },
    { name: 'darmanitan-galar-zen',          label: 'Galarian Darmanitan (Zen)', labelEs: 'Darmanitan de Galar (Zen)' },
  ],
  // Tornadus (#641)
  641: [
    { name: 'tornadus-therian', label: 'Tornadus (Therian)', labelEs: 'Tornadus (Tótem)' },
  ],
  // Thundurus (#642)
  642: [
    { name: 'thundurus-therian', label: 'Thundurus (Therian)', labelEs: 'Thundurus (Tótem)' },
  ],
  // Landorus (#645)
  645: [
    { name: 'landorus-therian', label: 'Landorus (Therian)', labelEs: 'Landorus (Tótem)' },
  ],
  // Kyurem (#646) — fusions with different stats/types
  646: [
    { name: 'kyurem-black', label: 'Black Kyurem', labelEs: 'Kyurem Negro' },
    { name: 'kyurem-white', label: 'White Kyurem', labelEs: 'Kyurem Blanco' },
  ],
  // Keldeo (#647)
  647: [
    { name: 'keldeo-resolute', label: 'Keldeo (Resolute)', labelEs: 'Keldeo (Brío)' },
  ],
  // Meloetta (#648) — different types/stats
  648: [
    { name: 'meloetta-pirouette', label: 'Meloetta (Pirouette)', labelEs: 'Meloetta (Danza)' },
  ],

  // ── Gen 6 ─────────────────────────────────────────
  // Aegislash (#681) — different stats
  681: [
    { name: 'aegislash-blade', label: 'Aegislash (Blade)', labelEs: 'Aegislash (Filo)' },
  ],
  // Pumpkaboo (#710) — different stats by size
  710: [
    { name: 'pumpkaboo-small', label: 'Pumpkaboo (Small)', labelEs: 'Pumpkaboo (Pequeño)' },
    { name: 'pumpkaboo-large', label: 'Pumpkaboo (Large)', labelEs: 'Pumpkaboo (Grande)' },
    { name: 'pumpkaboo-super', label: 'Pumpkaboo (Super)', labelEs: 'Pumpkaboo (Súper)' },
  ],
  // Gourgeist (#711) — different stats by size
  711: [
    { name: 'gourgeist-small', label: 'Gourgeist (Small)', labelEs: 'Gourgeist (Pequeño)' },
    { name: 'gourgeist-large', label: 'Gourgeist (Large)', labelEs: 'Gourgeist (Grande)' },
    { name: 'gourgeist-super', label: 'Gourgeist (Super)', labelEs: 'Gourgeist (Súper)' },
  ],
  // Hoopa (#720) — different stats/types
  720: [
    { name: 'hoopa-unbound', label: 'Hoopa (Unbound)', labelEs: 'Hoopa (Desatado)' },
  ],
  // Zygarde (#718) — different stats
  718: [
    { name: 'zygarde-10',       label: 'Zygarde (10%)',      labelEs: 'Zygarde (10%)' },
    { name: 'zygarde-complete', label: 'Zygarde (Complete)', labelEs: 'Zygarde (Completo)' },
  ],

  // ── Gen 7 ─────────────────────────────────────────
  // Oricorio (#741) — different types
  741: [
    { name: 'oricorio-pom-pom', label: 'Oricorio (Pom-Pom)', labelEs: 'Oricorio (Animado)' },
    { name: 'oricorio-pau',     label: "Oricorio (Pa'u)",     labelEs: 'Oricorio (Refinado)' },
    { name: 'oricorio-sensu',   label: 'Oricorio (Sensu)',    labelEs: 'Oricorio (Sereno)' },
  ],
  // Lycanroc (#745) — different stats/abilities
  745: [
    { name: 'lycanroc-midnight', label: 'Lycanroc (Midnight)', labelEs: 'Lycanroc (Nocturno)' },
    { name: 'lycanroc-dusk',     label: 'Lycanroc (Dusk)',     labelEs: 'Lycanroc (Crepuscular)' },
  ],
  // Wishiwashi (#746) — very different stats
  746: [
    { name: 'wishiwashi-school', label: 'Wishiwashi (School)', labelEs: 'Wishiwashi (Banco)' },
  ],
  // Necrozma (#800) — fusions with different stats/types
  800: [
    { name: 'necrozma-dusk-mane',  label: 'Necrozma (Dusk Mane)',  labelEs: 'Necrozma (Melena Crepúsculo)' },
    { name: 'necrozma-dawn-wings', label: 'Necrozma (Dawn Wings)', labelEs: 'Necrozma (Alas Alba)' },
    { name: 'necrozma-ultra',      label: 'Ultra Necrozma',        labelEs: 'Ultra Necrozma' },
  ],

  // ── Gen 8 ─────────────────────────────────────────
  // Toxtricity (#849) — different ability/moves
  849: [
    { name: 'toxtricity-low-key', label: 'Toxtricity (Low Key)', labelEs: 'Toxtricity (Grave)' },
  ],
  // Urshifu (#892) — different types
  892: [
    { name: 'urshifu-rapid-strike', label: 'Urshifu (Rapid Strike)', labelEs: 'Urshifu (Fluido)' },
  ],
  // Calyrex (#898) — fusions with different stats/types
  898: [
    { name: 'calyrex-ice-rider',    label: 'Calyrex (Ice Rider)',    labelEs: 'Calyrex (Jinete Glacial)' },
    { name: 'calyrex-shadow-rider', label: 'Calyrex (Shadow Rider)', labelEs: 'Calyrex (Jinete Espectral)' },
  ],
  // Enamorus (#905)
  905: [
    { name: 'enamorus-therian', label: 'Enamorus (Therian)', labelEs: 'Enamorus (Tótem)' },
  ],

  // ── Gen 9 ─────────────────────────────────────────
  // Palafin (#964) — very different stats
  964: [
    { name: 'palafin-hero', label: 'Palafin (Hero)', labelEs: 'Palafin (Heroico)' },
  ],
  // Gholdengo (#1000) — no alt forms
  // Ogerpon (#1017) — different types with masks
  1017: [
    { name: 'ogerpon-wellspring-mask',  label: 'Ogerpon (Wellspring)',  labelEs: 'Ogerpon (Fuente)' },
    { name: 'ogerpon-hearthflame-mask', label: 'Ogerpon (Hearthflame)', labelEs: 'Ogerpon (Horno)' },
    { name: 'ogerpon-cornerstone-mask', label: 'Ogerpon (Cornerstone)', labelEs: 'Ogerpon (Cimiento)' },
  ],
  // Terapagos (#1024) — different stats
  1024: [
    { name: 'terapagos-terastal', label: 'Terapagos (Terastal)', labelEs: 'Terapagos (Terastal)' },
  ],
};

export function getAltForms(pokemonId: number): AltForm[] {
  return ALT_FORMS[pokemonId] ?? [];
}
