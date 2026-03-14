import { useState, useEffect, useRef } from 'react';

export interface ItemEntry {
  slug: string;
  name: string;
  sprite: string;
  spriteFallback: string;
  category: string;
  desc: string;
}

const LOCAL_SPRITE_BASE = '/sprites-items';
const POKEAPI_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

const LOCAL_SPRITES: Record<string, string> = {
  'heavy-duty-boots': 'heavy-duty-boots.webp',
  'booster-energy': 'booster-energy.png',
  'loaded-dice': 'loaded-dice.png',
  'punching-glove': 'punching-glove.png',
  'throat-spray': 'throat-spray.png',
  'covert-cloak': 'covert-cloak.png',
  'clear-amulet': 'clear-amulet.png',
  'utility-umbrella': 'utility-umbrella.png',
  'mirror-herb': 'mirror-herb.webp',
  'eject-pack': 'eject-pack.png',
  'room-service': 'room-service.png',
  'blunder-policy': 'blunder-policy.png',
  'fairy-feather': 'fairy-feather.png',
  'rusted-sword': 'rusted-sword.webp',
  'rusted-shield': 'rusted-shield.webp',
};

interface RawItem {
  slug: string;
  category: string;
  descEn: string;
}

function sprite(slug: string) {
  const localFile = LOCAL_SPRITES[slug];
  return {
    sprite: localFile ? `${LOCAL_SPRITE_BASE}/${localFile}` : `${POKEAPI_SPRITE_BASE}/${slug}.png`,
    spriteFallback: `${POKEAPI_SPRITE_BASE}/${slug}.png`,
  };
}

function formatSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ── Curated battle-viable held items ───────────────────────────────── */

const RAW_ITEMS: RawItem[] = [
  // ── Core competitive ──
  { slug: 'leftovers', category: 'recovery', descEn: 'Restores 1/16 max HP every turn.' },
  { slug: 'life-orb', category: 'damage', descEn: '1.3× damage but costs 1/10 max HP per attack.' },
  { slug: 'choice-band', category: 'choice', descEn: '1.5× Attack but locks into one move.' },
  { slug: 'choice-specs', category: 'choice', descEn: '1.5× Sp. Atk but locks into one move.' },
  { slug: 'choice-scarf', category: 'choice', descEn: '1.5× Speed but locks into one move.' },
  { slug: 'focus-sash', category: 'defensive', descEn: 'Survives a KO hit at 1 HP when at full HP.' },
  { slug: 'assault-vest', category: 'defensive', descEn: '1.5× Sp. Def but can only use attacking moves.' },
  { slug: 'eviolite', category: 'defensive', descEn: '1.5× Def and Sp. Def for not fully evolved Pokémon.' },
  { slug: 'heavy-duty-boots', category: 'utility', descEn: 'Protects from entry hazard damage.' },
  { slug: 'rocky-helmet', category: 'defensive', descEn: 'Contact moves deal 1/6 max HP to the attacker.' },
  { slug: 'air-balloon', category: 'utility', descEn: 'Grants Ground immunity until hit by an attack.' },
  { slug: 'expert-belt', category: 'damage', descEn: 'Super effective moves deal 1.2× damage.' },
  { slug: 'weakness-policy', category: 'boost', descEn: '+2 Attack and Sp. Atk when hit by a super effective move.' },
  { slug: 'booster-energy', category: 'boost', descEn: 'Activates Protosynthesis or Quark Drive.' },

  // ── Orbs & status ──
  { slug: 'toxic-orb', category: 'status', descEn: 'Badly poisons the holder at end of turn. Combos with Poison Heal/Guts.' },
  { slug: 'flame-orb', category: 'status', descEn: 'Burns the holder at end of turn. Combos with Guts/Magic Guard.' },
  { slug: 'light-ball', category: 'damage', descEn: "Doubles Pikachu's Attack and Sp. Atk." },

  // ── Offensive ──
  { slug: 'scope-lens', category: 'damage', descEn: 'Raises critical hit ratio by one stage.' },
  { slug: 'razor-claw', category: 'damage', descEn: 'Raises critical hit ratio by one stage.' },
  { slug: 'metronome', category: 'damage', descEn: 'Boosts move power by 20% each consecutive use (max 2×).' },
  { slug: 'loaded-dice', category: 'damage', descEn: 'Multi-hit moves hit 4-5 times guaranteed.' },
  { slug: 'punching-glove', category: 'damage', descEn: '1.1× punching move power and prevents contact effects.' },
  { slug: 'throat-spray', category: 'boost', descEn: '+1 Sp. Atk after using a sound-based move. Single use.' },
  { slug: 'shell-bell', category: 'recovery', descEn: 'Restores 1/8 of damage dealt to the opponent.' },

  // ── Defensive / utility ──
  { slug: 'safety-goggles', category: 'utility', descEn: 'Immune to weather damage and powder moves.' },
  { slug: 'covert-cloak', category: 'utility', descEn: 'Protects from secondary effects of moves.' },
  { slug: 'clear-amulet', category: 'utility', descEn: 'Prevents stat reduction by other Pokémon.' },
  { slug: 'shed-shell', category: 'utility', descEn: 'Allows switching out even when trapped.' },
  { slug: 'utility-umbrella', category: 'utility', descEn: 'Negates weather effects on the holder.' },
  { slug: 'protective-pads', category: 'utility', descEn: 'Protects from contact move side effects.' },
  { slug: 'black-sludge', category: 'recovery', descEn: 'Poison types restore 1/16 HP per turn; others lose 1/8 HP.' },

  // ── Herbs ──
  { slug: 'mental-herb', category: 'utility', descEn: 'Cures infatuation, Taunt, Encore, Torment, Disable, and Heal Block. Single use.' },
  { slug: 'power-herb', category: 'utility', descEn: 'Two-turn moves execute in one turn. Single use.' },
  { slug: 'white-herb', category: 'utility', descEn: 'Restores lowered stats to normal. Single use.' },
  { slug: 'mirror-herb', category: 'utility', descEn: "Copies the opponent's stat boosts. Single use." },

  // ── Reaction items ──
  { slug: 'red-card', category: 'utility', descEn: 'Forces the attacker to switch out after hitting the holder. Single use.' },
  { slug: 'eject-button', category: 'utility', descEn: 'Holder switches out when hit by an attack. Single use.' },
  { slug: 'eject-pack', category: 'utility', descEn: 'Holder switches out when any of its stats are lowered. Single use.' },
  { slug: 'room-service', category: 'boost', descEn: 'Lowers Speed by 1 stage when Trick Room is set. Single use.' },
  { slug: 'blunder-policy', category: 'boost', descEn: '+2 Speed when a move misses. Single use.' },
  { slug: 'adrenaline-orb', category: 'boost', descEn: '+1 Speed when intimidated. Single use.' },

  // ── Terrain & weather extenders ──
  { slug: 'light-clay', category: 'support', descEn: 'Extends Light Screen and Reflect from 5 to 8 turns.' },
  { slug: 'terrain-extender', category: 'support', descEn: 'Extends terrain effects from 5 to 8 turns.' },
  { slug: 'heat-rock', category: 'support', descEn: 'Extends Sunny Day from 5 to 8 turns.' },
  { slug: 'damp-rock', category: 'support', descEn: 'Extends Rain Dance from 5 to 8 turns.' },
  { slug: 'smooth-rock', category: 'support', descEn: 'Extends Sandstorm from 5 to 8 turns.' },
  { slug: 'icy-rock', category: 'support', descEn: 'Extends Hail/Snow from 5 to 8 turns.' },
  { slug: 'grip-claw', category: 'support', descEn: 'Binding moves last 7 turns instead of 4-5.' },

  // ── Type-boosting items ──
  { slug: 'charcoal', category: 'type-boost', descEn: '1.2× Fire-type move power.' },
  { slug: 'mystic-water', category: 'type-boost', descEn: '1.2× Water-type move power.' },
  { slug: 'miracle-seed', category: 'type-boost', descEn: '1.2× Grass-type move power.' },
  { slug: 'magnet', category: 'type-boost', descEn: '1.2× Electric-type move power.' },
  { slug: 'never-melt-ice', category: 'type-boost', descEn: '1.2× Ice-type move power.' },
  { slug: 'black-belt', category: 'type-boost', descEn: '1.2× Fighting-type move power.' },
  { slug: 'poison-barb', category: 'type-boost', descEn: '1.2× Poison-type move power.' },
  { slug: 'soft-sand', category: 'type-boost', descEn: '1.2× Ground-type move power.' },
  { slug: 'sharp-beak', category: 'type-boost', descEn: '1.2× Flying-type move power.' },
  { slug: 'twisted-spoon', category: 'type-boost', descEn: '1.2× Psychic-type move power.' },
  { slug: 'silver-powder', category: 'type-boost', descEn: '1.2× Bug-type move power.' },
  { slug: 'hard-stone', category: 'type-boost', descEn: '1.2× Rock-type move power.' },
  { slug: 'spell-tag', category: 'type-boost', descEn: '1.2× Ghost-type move power.' },
  { slug: 'dragon-fang', category: 'type-boost', descEn: '1.2× Dragon-type move power.' },
  { slug: 'black-glasses', category: 'type-boost', descEn: '1.2× Dark-type move power.' },
  { slug: 'metal-coat', category: 'type-boost', descEn: '1.2× Steel-type move power.' },
  { slug: 'silk-scarf', category: 'type-boost', descEn: '1.2× Normal-type move power.' },
  { slug: 'fairy-feather', category: 'type-boost', descEn: '1.2× Fairy-type move power.' },

  // ── Gems ──
  { slug: 'normal-gem', category: 'type-boost', descEn: '1.3× power for one Normal-type move. Single use.' },

  // ── Plates ──
  { slug: 'flame-plate', category: 'type-boost', descEn: '1.2× Fire-type move power. Changes Arceus to Fire type.' },
  { slug: 'splash-plate', category: 'type-boost', descEn: '1.2× Water-type move power. Changes Arceus to Water type.' },
  { slug: 'meadow-plate', category: 'type-boost', descEn: '1.2× Grass-type move power. Changes Arceus to Grass type.' },
  { slug: 'zap-plate', category: 'type-boost', descEn: '1.2× Electric-type move power. Changes Arceus to Electric type.' },
  { slug: 'icicle-plate', category: 'type-boost', descEn: '1.2× Ice-type move power. Changes Arceus to Ice type.' },
  { slug: 'fist-plate', category: 'type-boost', descEn: '1.2× Fighting-type move power. Changes Arceus to Fighting type.' },
  { slug: 'toxic-plate', category: 'type-boost', descEn: '1.2× Poison-type move power. Changes Arceus to Poison type.' },
  { slug: 'earth-plate', category: 'type-boost', descEn: '1.2× Ground-type move power. Changes Arceus to Ground type.' },
  { slug: 'sky-plate', category: 'type-boost', descEn: '1.2× Flying-type move power. Changes Arceus to Flying type.' },
  { slug: 'mind-plate', category: 'type-boost', descEn: '1.2× Psychic-type move power. Changes Arceus to Psychic type.' },
  { slug: 'insect-plate', category: 'type-boost', descEn: '1.2× Bug-type move power. Changes Arceus to Bug type.' },
  { slug: 'stone-plate', category: 'type-boost', descEn: '1.2× Rock-type move power. Changes Arceus to Rock type.' },
  { slug: 'spooky-plate', category: 'type-boost', descEn: '1.2× Ghost-type move power. Changes Arceus to Ghost type.' },
  { slug: 'draco-plate', category: 'type-boost', descEn: '1.2× Dragon-type move power. Changes Arceus to Dragon type.' },
  { slug: 'dread-plate', category: 'type-boost', descEn: '1.2× Dark-type move power. Changes Arceus to Dark type.' },
  { slug: 'iron-plate', category: 'type-boost', descEn: '1.2× Steel-type move power. Changes Arceus to Steel type.' },
  { slug: 'pixie-plate', category: 'type-boost', descEn: '1.2× Fairy-type move power. Changes Arceus to Fairy type.' },

  // ── Berries: recovery & status cure ──
  { slug: 'sitrus-berry', category: 'berry', descEn: 'Restores 1/4 max HP when HP drops below 50%.' },
  { slug: 'lum-berry', category: 'berry', descEn: 'Cures any status condition. Single use.' },
  { slug: 'aguav-berry', category: 'berry', descEn: 'Restores 1/3 HP when HP drops below 25%.' },
  { slug: 'figy-berry', category: 'berry', descEn: 'Restores 1/3 HP when HP drops below 25%.' },
  { slug: 'iapapa-berry', category: 'berry', descEn: 'Restores 1/3 HP when HP drops below 25%.' },
  { slug: 'mago-berry', category: 'berry', descEn: 'Restores 1/3 HP when HP drops below 25%.' },
  { slug: 'wiki-berry', category: 'berry', descEn: 'Restores 1/3 HP when HP drops below 25%.' },
  { slug: 'chesto-berry', category: 'berry', descEn: 'Wakes up the holder from Sleep. Single use.' },
  { slug: 'rawst-berry', category: 'berry', descEn: 'Cures the holder of a Burn. Single use.' },
  { slug: 'pecha-berry', category: 'berry', descEn: 'Cures the holder of Poison. Single use.' },
  { slug: 'cheri-berry', category: 'berry', descEn: 'Cures the holder of Paralysis. Single use.' },
  { slug: 'aspear-berry', category: 'berry', descEn: 'Cures the holder of Freeze. Single use.' },
  { slug: 'persim-berry', category: 'berry', descEn: 'Cures the holder of Confusion. Single use.' },

  // ── Berries: type resistance ──
  { slug: 'occa-berry', category: 'berry', descEn: 'Halves damage from one super effective Fire-type move.' },
  { slug: 'passho-berry', category: 'berry', descEn: 'Halves damage from one super effective Water-type move.' },
  { slug: 'wacan-berry', category: 'berry', descEn: 'Halves damage from one super effective Electric-type move.' },
  { slug: 'rindo-berry', category: 'berry', descEn: 'Halves damage from one super effective Grass-type move.' },
  { slug: 'yache-berry', category: 'berry', descEn: 'Halves damage from one super effective Ice-type move.' },
  { slug: 'chople-berry', category: 'berry', descEn: 'Halves damage from one super effective Fighting-type move.' },
  { slug: 'kebia-berry', category: 'berry', descEn: 'Halves damage from one super effective Poison-type move.' },
  { slug: 'shuca-berry', category: 'berry', descEn: 'Halves damage from one super effective Ground-type move.' },
  { slug: 'coba-berry', category: 'berry', descEn: 'Halves damage from one super effective Flying-type move.' },
  { slug: 'payapa-berry', category: 'berry', descEn: 'Halves damage from one super effective Psychic-type move.' },
  { slug: 'tanga-berry', category: 'berry', descEn: 'Halves damage from one super effective Bug-type move.' },
  { slug: 'charti-berry', category: 'berry', descEn: 'Halves damage from one super effective Rock-type move.' },
  { slug: 'kasib-berry', category: 'berry', descEn: 'Halves damage from one super effective Ghost-type move.' },
  { slug: 'haban-berry', category: 'berry', descEn: 'Halves damage from one super effective Dragon-type move.' },
  { slug: 'colbur-berry', category: 'berry', descEn: 'Halves damage from one super effective Dark-type move.' },
  { slug: 'babiri-berry', category: 'berry', descEn: 'Halves damage from one super effective Steel-type move.' },
  { slug: 'roseli-berry', category: 'berry', descEn: 'Halves damage from one super effective Fairy-type move.' },

  // ── Berries: pinch stat boost ──
  { slug: 'liechi-berry', category: 'berry', descEn: '+1 Attack when HP drops below 25%.' },
  { slug: 'ganlon-berry', category: 'berry', descEn: '+1 Defense when HP drops below 25%.' },
  { slug: 'salac-berry', category: 'berry', descEn: '+1 Speed when HP drops below 25%.' },
  { slug: 'petaya-berry', category: 'berry', descEn: '+1 Sp. Atk when HP drops below 25%.' },
  { slug: 'apicot-berry', category: 'berry', descEn: '+1 Sp. Def when HP drops below 25%.' },
  { slug: 'lansat-berry', category: 'berry', descEn: '+1 critical hit ratio when HP drops below 25%.' },
  { slug: 'starf-berry', category: 'berry', descEn: '+2 to a random stat when HP drops below 25%.' },
  { slug: 'micle-berry', category: 'berry', descEn: '+1.2× accuracy for the next move when HP drops below 25%.' },
  { slug: 'custap-berry', category: 'berry', descEn: 'Moves first in priority bracket when HP drops below 25%.' },

  // ── Berries: other combat ──
  { slug: 'leppa-berry', category: 'berry', descEn: 'Restores 10 PP to a depleted move.' },
  { slug: 'jaboca-berry', category: 'berry', descEn: 'Deals 1/8 max HP to attacker when hit by a physical move.' },
  { slug: 'rowap-berry', category: 'berry', descEn: 'Deals 1/8 max HP to attacker when hit by a special move.' },
  { slug: 'kee-berry', category: 'berry', descEn: '+1 Defense when hit by a physical move.' },
  { slug: 'maranga-berry', category: 'berry', descEn: '+1 Sp. Def when hit by a special move.' },

  // ── Species-specific ──
  { slug: 'thick-club', category: 'species', descEn: "Doubles Cubone and Marowak's Attack." },
  { slug: 'lucky-punch', category: 'species', descEn: "Raises Chansey's critical hit ratio by 2 stages." },
  { slug: 'deep-sea-tooth', category: 'species', descEn: "Doubles Clamperl's Sp. Atk." },
  { slug: 'deep-sea-scale', category: 'species', descEn: "Doubles Clamperl's Sp. Def." },
  { slug: 'soul-dew', category: 'species', descEn: '1.2× Psychic and Dragon moves for Latios/Latias.' },
  { slug: 'adamant-orb', category: 'species', descEn: '1.2× Dragon and Steel moves for Dialga.' },
  { slug: 'lustrous-orb', category: 'species', descEn: '1.2× Dragon and Water moves for Palkia.' },
  { slug: 'griseous-orb', category: 'species', descEn: '1.2× Dragon and Ghost moves for Giratina. Changes to Origin Forme.' },
  { slug: 'rusted-sword', category: 'species', descEn: 'Changes Zacian to Crowned Sword forme. Gains Steel type.' },
  { slug: 'rusted-shield', category: 'species', descEn: 'Changes Zamazenta to Crowned Shield forme. Gains Steel type.' },

  // ── Misc competitive ──
  { slug: 'wide-lens', category: 'utility', descEn: '1.1× accuracy for all moves.' },
  { slug: 'zoom-lens', category: 'utility', descEn: '1.2× accuracy if the holder moves after the target.' },
  { slug: 'kings-rock', category: 'utility', descEn: '10% flinch chance on damaging moves.' },
  { slug: 'bright-powder', category: 'utility', descEn: "Lowers opponent's accuracy by 10%." },
  { slug: 'lax-incense', category: 'utility', descEn: "Lowers opponent's accuracy by 10%." },
  { slug: 'ring-target', category: 'utility', descEn: 'Moves that would have no effect due to type land normally.' },
  { slug: 'iron-ball', category: 'utility', descEn: 'Halves Speed and grounds Flying types. Grounds holder.' },
  { slug: 'lagging-tail', category: 'utility', descEn: 'Holder always moves last in its priority bracket.' },
  { slug: 'quick-claw', category: 'utility', descEn: '20% chance to move first in its priority bracket.' },
  { slug: 'absorb-bulb', category: 'boost', descEn: '+1 Sp. Atk when hit by a Water-type move. Single use.' },
  { slug: 'cell-battery', category: 'boost', descEn: '+1 Attack when hit by an Electric-type move. Single use.' },
  { slug: 'luminous-moss', category: 'boost', descEn: '+1 Sp. Def when hit by a Water-type move. Single use.' },
  { slug: 'snowball', category: 'boost', descEn: '+1 Attack when hit by an Ice-type move. Single use.' },

  // ── Mega Stones ──
  { slug: 'venusaurite', category: 'mega-stone', descEn: 'Mega Evolves Venusaur.' },
  { slug: 'charizardite-x', category: 'mega-stone', descEn: 'Mega Evolves Charizard into Mega Charizard X.' },
  { slug: 'charizardite-y', category: 'mega-stone', descEn: 'Mega Evolves Charizard into Mega Charizard Y.' },
  { slug: 'blastoisinite', category: 'mega-stone', descEn: 'Mega Evolves Blastoise.' },
  { slug: 'beedrillite', category: 'mega-stone', descEn: 'Mega Evolves Beedrill.' },
  { slug: 'pidgeotite', category: 'mega-stone', descEn: 'Mega Evolves Pidgeot.' },
  { slug: 'alakazite', category: 'mega-stone', descEn: 'Mega Evolves Alakazam.' },
  { slug: 'slowbronite', category: 'mega-stone', descEn: 'Mega Evolves Slowbro.' },
  { slug: 'gengarite', category: 'mega-stone', descEn: 'Mega Evolves Gengar.' },
  { slug: 'kangaskhanite', category: 'mega-stone', descEn: 'Mega Evolves Kangaskhan.' },
  { slug: 'pinsirite', category: 'mega-stone', descEn: 'Mega Evolves Pinsir.' },
  { slug: 'gyaradosite', category: 'mega-stone', descEn: 'Mega Evolves Gyarados.' },
  { slug: 'aerodactylite', category: 'mega-stone', descEn: 'Mega Evolves Aerodactyl.' },
  { slug: 'mewtwonite-x', category: 'mega-stone', descEn: 'Mega Evolves Mewtwo into Mega Mewtwo X.' },
  { slug: 'mewtwonite-y', category: 'mega-stone', descEn: 'Mega Evolves Mewtwo into Mega Mewtwo Y.' },
  { slug: 'ampharosite', category: 'mega-stone', descEn: 'Mega Evolves Ampharos.' },
  { slug: 'steelixite', category: 'mega-stone', descEn: 'Mega Evolves Steelix.' },
  { slug: 'scizorite', category: 'mega-stone', descEn: 'Mega Evolves Scizor.' },
  { slug: 'heracronite', category: 'mega-stone', descEn: 'Mega Evolves Heracross.' },
  { slug: 'houndoominite', category: 'mega-stone', descEn: 'Mega Evolves Houndoom.' },
  { slug: 'tyranitarite', category: 'mega-stone', descEn: 'Mega Evolves Tyranitar.' },
  { slug: 'sceptilite', category: 'mega-stone', descEn: 'Mega Evolves Sceptile.' },
  { slug: 'blazikenite', category: 'mega-stone', descEn: 'Mega Evolves Blaziken.' },
  { slug: 'swampertite', category: 'mega-stone', descEn: 'Mega Evolves Swampert.' },
  { slug: 'gardevoirite', category: 'mega-stone', descEn: 'Mega Evolves Gardevoir.' },
  { slug: 'sablenite', category: 'mega-stone', descEn: 'Mega Evolves Sableye.' },
  { slug: 'mawilite', category: 'mega-stone', descEn: 'Mega Evolves Mawile.' },
  { slug: 'aggronite', category: 'mega-stone', descEn: 'Mega Evolves Aggron.' },
  { slug: 'medichamite', category: 'mega-stone', descEn: 'Mega Evolves Medicham.' },
  { slug: 'manectite', category: 'mega-stone', descEn: 'Mega Evolves Manectric.' },
  { slug: 'sharpedonite', category: 'mega-stone', descEn: 'Mega Evolves Sharpedo.' },
  { slug: 'cameruptite', category: 'mega-stone', descEn: 'Mega Evolves Camerupt.' },
  { slug: 'altarianite', category: 'mega-stone', descEn: 'Mega Evolves Altaria.' },
  { slug: 'banettite', category: 'mega-stone', descEn: 'Mega Evolves Banette.' },
  { slug: 'absolite', category: 'mega-stone', descEn: 'Mega Evolves Absol.' },
  { slug: 'glalitite', category: 'mega-stone', descEn: 'Mega Evolves Glalie.' },
  { slug: 'salamencite', category: 'mega-stone', descEn: 'Mega Evolves Salamence.' },
  { slug: 'metagrossite', category: 'mega-stone', descEn: 'Mega Evolves Metagross.' },
  { slug: 'latiasite', category: 'mega-stone', descEn: 'Mega Evolves Latias.' },
  { slug: 'latiosite', category: 'mega-stone', descEn: 'Mega Evolves Latios.' },
  { slug: 'lopunnite', category: 'mega-stone', descEn: 'Mega Evolves Lopunny.' },
  { slug: 'garchompite', category: 'mega-stone', descEn: 'Mega Evolves Garchomp.' },
  { slug: 'lucarionite', category: 'mega-stone', descEn: 'Mega Evolves Lucario.' },
  { slug: 'abomasite', category: 'mega-stone', descEn: 'Mega Evolves Abomasnow.' },
  { slug: 'galladite', category: 'mega-stone', descEn: 'Mega Evolves Gallade.' },
  { slug: 'audinite', category: 'mega-stone', descEn: 'Mega Evolves Audino.' },
  { slug: 'diancite', category: 'mega-stone', descEn: 'Mega Evolves Diancie.' },
];

/* ── Localized item cache — keyed by `lang:slug` ───────────────────── */

const ITEM_CACHE_MAX = 500;
const itemI18nCache = new Map<string, { name: string; desc: string }>();

function setItemCache(key: string, value: { name: string; desc: string }) {
  if (itemI18nCache.size >= ITEM_CACHE_MAX) {
    const firstKey = itemI18nCache.keys().next().value!;
    itemI18nCache.delete(firstKey);
  }
  itemI18nCache.set(key, value);
}

async function fetchItemI18n(slug: string, lang: string): Promise<{ name: string; desc: string }> {
  const res = await fetch(`https://pokeapi.co/api/v2/item/${slug}`);
  if (!res.ok) return { name: formatSlug(slug), desc: '' };
  const data = await res.json() as {
    names: Array<{ name: string; language: { name: string } }>;
    flavor_text_entries: Array<{ text: string; language: { name: string } }>;
    effect_entries: Array<{ short_effect: string; language: { name: string } }>;
  };
  const localName = data.names?.find(n => n.language.name === lang)?.name
    ?? data.names?.find(n => n.language.name === 'en')?.name
    ?? formatSlug(slug);
  const localDesc = data.effect_entries?.find(e => e.language.name === lang)?.short_effect
    ?? data.flavor_text_entries?.filter(f => f.language.name === lang).pop()?.text
    ?? data.effect_entries?.find(e => e.language.name === 'en')?.short_effect
    ?? data.flavor_text_entries?.filter(f => f.language.name === 'en').pop()?.text
    ?? '';
  return { name: localName, desc: localDesc };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function buildItems(lang: string): ItemEntry[] {
  return RAW_ITEMS.map(raw => {
    const key = `${lang}:${raw.slug}`;
    const cached = itemI18nCache.get(key);
    const sprites = sprite(raw.slug);
    return {
      slug: raw.slug,
      name: cached?.name ?? formatSlug(raw.slug),
      ...sprites,
      category: raw.category,
      desc: cached?.desc || raw.descEn,
    };
  });
}

export function useItemList(lang = 'en'): { items: ItemEntry[]; loading: boolean } {
  const [items, setItems] = useState<ItemEntry[]>(() => buildItems(lang));
  const [loading, setLoading] = useState(false);
  const runIdRef = useRef(0);

  useEffect(() => {
    // For English, just use slug-based names + hardcoded descriptions
    if (lang === 'en') {
      setItems(buildItems(lang));
      setLoading(false);
      return;
    }

    const currentRun = ++runIdRef.current;

    // Check which items still need fetching
    const uncached = RAW_ITEMS.filter(r => !itemI18nCache.has(`${lang}:${r.slug}`));

    if (uncached.length === 0) {
      setItems(buildItems(lang));
      setLoading(false);
      return;
    }

    // Show what we have so far (slug-formatted names for uncached)
    setItems(buildItems(lang));
    setLoading(true);

    const chunks = chunkArray(uncached, 8);

    (async () => {
      for (let ci = 0; ci < chunks.length; ci++) {
        if (runIdRef.current !== currentRun) return;
        if (ci > 0) await new Promise(r => setTimeout(r, 300));
        const results = await Promise.allSettled(
          chunks[ci].map(raw => fetchItemI18n(raw.slug, lang))
        );
        if (runIdRef.current !== currentRun) return;
        for (let j = 0; j < results.length; j++) {
          if (results[j].status === 'fulfilled') {
            const val = (results[j] as PromiseFulfilledResult<{ name: string; desc: string }>).value;
            setItemCache(`${lang}:${chunks[ci][j].slug}`, val);
          }
        }
        // Update items progressively
        setItems(buildItems(lang));
      }
      if (runIdRef.current === currentRun) setLoading(false);
    })();

    return () => { runIdRef.current++; };
  }, [lang]);

  return { items, loading };
}
