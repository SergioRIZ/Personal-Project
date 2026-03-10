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

function e(slug: string, category: string, desc: string): ItemEntry {
  const localFile = LOCAL_SPRITES[slug];
  return {
    slug,
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    sprite: localFile ? `${LOCAL_SPRITE_BASE}/${localFile}` : `${POKEAPI_SPRITE_BASE}/${slug}.png`,
    spriteFallback: `${POKEAPI_SPRITE_BASE}/${slug}.png`,
    category,
    desc,
  };
}

/* ── Curated battle-viable held items with descriptions ───────────────── */

const BATTLE_ITEMS: ItemEntry[] = [
  // ── Core competitive ──
  e('leftovers', 'recovery', 'Restores 1/16 max HP every turn.'),
  e('life-orb', 'damage', '1.3× damage but costs 1/10 max HP per attack.'),
  e('choice-band', 'choice', '1.5× Attack but locks into one move.'),
  e('choice-specs', 'choice', '1.5× Sp. Atk but locks into one move.'),
  e('choice-scarf', 'choice', '1.5× Speed but locks into one move.'),
  e('focus-sash', 'defensive', 'Survives a KO hit at 1 HP when at full HP.'),
  e('assault-vest', 'defensive', '1.5× Sp. Def but can only use attacking moves.'),
  e('eviolite', 'defensive', '1.5× Def and Sp. Def for not fully evolved Pokémon.'),
  e('heavy-duty-boots', 'utility', 'Protects from entry hazard damage.'),
  e('rocky-helmet', 'defensive', 'Contact moves deal 1/6 max HP to the attacker.'),
  e('air-balloon', 'utility', 'Grants Ground immunity until hit by an attack.'),
  e('expert-belt', 'damage', 'Super effective moves deal 1.2× damage.'),
  e('weakness-policy', 'boost', '+2 Attack and Sp. Atk when hit by a super effective move.'),
  e('booster-energy', 'boost', 'Activates Protosynthesis or Quark Drive.'),

  // ── Orbs & status ──
  e('toxic-orb', 'status', 'Badly poisons the holder at end of turn. Combos with Poison Heal/Guts.'),
  e('flame-orb', 'status', 'Burns the holder at end of turn. Combos with Guts/Magic Guard.'),
  e('light-ball', 'damage', 'Doubles Pikachu\'s Attack and Sp. Atk.'),

  // ── Offensive ──
  e('scope-lens', 'damage', 'Raises critical hit ratio by one stage.'),
  e('razor-claw', 'damage', 'Raises critical hit ratio by one stage.'),
  e('metronome', 'damage', 'Boosts move power by 20% each consecutive use (max 2×).'),
  e('loaded-dice', 'damage', 'Multi-hit moves hit 4-5 times guaranteed.'),
  e('punching-glove', 'damage', '1.1× punching move power and prevents contact effects.'),
  e('throat-spray', 'boost', '+1 Sp. Atk after using a sound-based move. Single use.'),
  e('shell-bell', 'recovery', 'Restores 1/8 of damage dealt to the opponent.'),

  // ── Defensive / utility ──
  e('safety-goggles', 'utility', 'Immune to weather damage and powder moves.'),
  e('covert-cloak', 'utility', 'Protects from secondary effects of moves.'),
  e('clear-amulet', 'utility', 'Prevents stat reduction by other Pokémon.'),
  e('shed-shell', 'utility', 'Allows switching out even when trapped.'),
  e('utility-umbrella', 'utility', 'Negates weather effects on the holder.'),
  e('protective-pads', 'utility', 'Protects from contact move side effects.'),
  e('black-sludge', 'recovery', 'Poison types restore 1/16 HP per turn; others lose 1/8 HP.'),

  // ── Herbs ──
  e('mental-herb', 'utility', 'Cures infatuation, Taunt, Encore, Torment, Disable, and Heal Block. Single use.'),
  e('power-herb', 'utility', 'Two-turn moves execute in one turn. Single use.'),
  e('white-herb', 'utility', 'Restores lowered stats to normal. Single use.'),
  e('mirror-herb', 'utility', 'Copies the opponent\'s stat boosts. Single use.'),

  // ── Reaction items ──
  e('red-card', 'utility', 'Forces the attacker to switch out after hitting the holder. Single use.'),
  e('eject-button', 'utility', 'Holder switches out when hit by an attack. Single use.'),
  e('eject-pack', 'utility', 'Holder switches out when any of its stats are lowered. Single use.'),
  e('room-service', 'boost', 'Lowers Speed by 1 stage when Trick Room is set. Single use.'),
  e('blunder-policy', 'boost', '+2 Speed when a move misses. Single use.'),
  e('adrenaline-orb', 'boost', '+1 Speed when intimidated. Single use.'),

  // ── Terrain & weather extenders ──
  e('light-clay', 'support', 'Extends Light Screen and Reflect from 5 to 8 turns.'),
  e('terrain-extender', 'support', 'Extends terrain effects from 5 to 8 turns.'),
  e('heat-rock', 'support', 'Extends Sunny Day from 5 to 8 turns.'),
  e('damp-rock', 'support', 'Extends Rain Dance from 5 to 8 turns.'),
  e('smooth-rock', 'support', 'Extends Sandstorm from 5 to 8 turns.'),
  e('icy-rock', 'support', 'Extends Hail/Snow from 5 to 8 turns.'),
  e('grip-claw', 'support', 'Binding moves last 7 turns instead of 4-5.'),

  // ── Type-boosting items ──
  e('charcoal', 'type-boost', '1.2× Fire-type move power.'),
  e('mystic-water', 'type-boost', '1.2× Water-type move power.'),
  e('miracle-seed', 'type-boost', '1.2× Grass-type move power.'),
  e('magnet', 'type-boost', '1.2× Electric-type move power.'),
  e('never-melt-ice', 'type-boost', '1.2× Ice-type move power.'),
  e('black-belt', 'type-boost', '1.2× Fighting-type move power.'),
  e('poison-barb', 'type-boost', '1.2× Poison-type move power.'),
  e('soft-sand', 'type-boost', '1.2× Ground-type move power.'),
  e('sharp-beak', 'type-boost', '1.2× Flying-type move power.'),
  e('twisted-spoon', 'type-boost', '1.2× Psychic-type move power.'),
  e('silver-powder', 'type-boost', '1.2× Bug-type move power.'),
  e('hard-stone', 'type-boost', '1.2× Rock-type move power.'),
  e('spell-tag', 'type-boost', '1.2× Ghost-type move power.'),
  e('dragon-fang', 'type-boost', '1.2× Dragon-type move power.'),
  e('black-glasses', 'type-boost', '1.2× Dark-type move power.'),
  e('metal-coat', 'type-boost', '1.2× Steel-type move power.'),
  e('silk-scarf', 'type-boost', '1.2× Normal-type move power.'),
  e('fairy-feather', 'type-boost', '1.2× Fairy-type move power.'),

  // ── Gems ──
  e('normal-gem', 'type-boost', '1.3× power for one Normal-type move. Single use.'),

  // ── Plates ──
  e('flame-plate', 'type-boost', '1.2× Fire-type move power. Changes Arceus to Fire type.'),
  e('splash-plate', 'type-boost', '1.2× Water-type move power. Changes Arceus to Water type.'),
  e('meadow-plate', 'type-boost', '1.2× Grass-type move power. Changes Arceus to Grass type.'),
  e('zap-plate', 'type-boost', '1.2× Electric-type move power. Changes Arceus to Electric type.'),
  e('icicle-plate', 'type-boost', '1.2× Ice-type move power. Changes Arceus to Ice type.'),
  e('fist-plate', 'type-boost', '1.2× Fighting-type move power. Changes Arceus to Fighting type.'),
  e('toxic-plate', 'type-boost', '1.2× Poison-type move power. Changes Arceus to Poison type.'),
  e('earth-plate', 'type-boost', '1.2× Ground-type move power. Changes Arceus to Ground type.'),
  e('sky-plate', 'type-boost', '1.2× Flying-type move power. Changes Arceus to Flying type.'),
  e('mind-plate', 'type-boost', '1.2× Psychic-type move power. Changes Arceus to Psychic type.'),
  e('insect-plate', 'type-boost', '1.2× Bug-type move power. Changes Arceus to Bug type.'),
  e('stone-plate', 'type-boost', '1.2× Rock-type move power. Changes Arceus to Rock type.'),
  e('spooky-plate', 'type-boost', '1.2× Ghost-type move power. Changes Arceus to Ghost type.'),
  e('draco-plate', 'type-boost', '1.2× Dragon-type move power. Changes Arceus to Dragon type.'),
  e('dread-plate', 'type-boost', '1.2× Dark-type move power. Changes Arceus to Dark type.'),
  e('iron-plate', 'type-boost', '1.2× Steel-type move power. Changes Arceus to Steel type.'),
  e('pixie-plate', 'type-boost', '1.2× Fairy-type move power. Changes Arceus to Fairy type.'),

  // ── Berries: recovery & status cure ──
  e('sitrus-berry', 'berry', 'Restores 1/4 max HP when HP drops below 50%.'),
  e('lum-berry', 'berry', 'Cures any status condition. Single use.'),
  e('aguav-berry', 'berry', 'Restores 1/3 HP when HP drops below 25%.'),
  e('figy-berry', 'berry', 'Restores 1/3 HP when HP drops below 25%.'),
  e('iapapa-berry', 'berry', 'Restores 1/3 HP when HP drops below 25%.'),
  e('mago-berry', 'berry', 'Restores 1/3 HP when HP drops below 25%.'),
  e('wiki-berry', 'berry', 'Restores 1/3 HP when HP drops below 25%.'),
  e('chesto-berry', 'berry', 'Wakes up the holder from Sleep. Single use.'),
  e('rawst-berry', 'berry', 'Cures the holder of a Burn. Single use.'),
  e('pecha-berry', 'berry', 'Cures the holder of Poison. Single use.'),
  e('cheri-berry', 'berry', 'Cures the holder of Paralysis. Single use.'),
  e('aspear-berry', 'berry', 'Cures the holder of Freeze. Single use.'),
  e('persim-berry', 'berry', 'Cures the holder of Confusion. Single use.'),

  // ── Berries: type resistance (halve super effective hit) ──
  e('occa-berry', 'berry', 'Halves damage from one super effective Fire-type move.'),
  e('passho-berry', 'berry', 'Halves damage from one super effective Water-type move.'),
  e('wacan-berry', 'berry', 'Halves damage from one super effective Electric-type move.'),
  e('rindo-berry', 'berry', 'Halves damage from one super effective Grass-type move.'),
  e('yache-berry', 'berry', 'Halves damage from one super effective Ice-type move.'),
  e('chople-berry', 'berry', 'Halves damage from one super effective Fighting-type move.'),
  e('kebia-berry', 'berry', 'Halves damage from one super effective Poison-type move.'),
  e('shuca-berry', 'berry', 'Halves damage from one super effective Ground-type move.'),
  e('coba-berry', 'berry', 'Halves damage from one super effective Flying-type move.'),
  e('payapa-berry', 'berry', 'Halves damage from one super effective Psychic-type move.'),
  e('tanga-berry', 'berry', 'Halves damage from one super effective Bug-type move.'),
  e('charti-berry', 'berry', 'Halves damage from one super effective Rock-type move.'),
  e('kasib-berry', 'berry', 'Halves damage from one super effective Ghost-type move.'),
  e('haban-berry', 'berry', 'Halves damage from one super effective Dragon-type move.'),
  e('colbur-berry', 'berry', 'Halves damage from one super effective Dark-type move.'),
  e('babiri-berry', 'berry', 'Halves damage from one super effective Steel-type move.'),
  e('roseli-berry', 'berry', 'Halves damage from one super effective Fairy-type move.'),

  // ── Berries: pinch stat boost ──
  e('liechi-berry', 'berry', '+1 Attack when HP drops below 25%.'),
  e('ganlon-berry', 'berry', '+1 Defense when HP drops below 25%.'),
  e('salac-berry', 'berry', '+1 Speed when HP drops below 25%.'),
  e('petaya-berry', 'berry', '+1 Sp. Atk when HP drops below 25%.'),
  e('apicot-berry', 'berry', '+1 Sp. Def when HP drops below 25%.'),
  e('lansat-berry', 'berry', '+1 critical hit ratio when HP drops below 25%.'),
  e('starf-berry', 'berry', '+2 to a random stat when HP drops below 25%.'),
  e('micle-berry', 'berry', '+1.2× accuracy for the next move when HP drops below 25%.'),
  e('custap-berry', 'berry', 'Moves first in priority bracket when HP drops below 25%.'),

  // ── Berries: other combat ──
  e('leppa-berry', 'berry', 'Restores 10 PP to a depleted move.'),
  e('jaboca-berry', 'berry', 'Deals 1/8 max HP to attacker when hit by a physical move.'),
  e('rowap-berry', 'berry', 'Deals 1/8 max HP to attacker when hit by a special move.'),
  e('kee-berry', 'berry', '+1 Defense when hit by a physical move.'),
  e('maranga-berry', 'berry', '+1 Sp. Def when hit by a special move.'),

  // ── Species-specific ──
  e('thick-club', 'species', 'Doubles Cubone and Marowak\'s Attack.'),
  e('lucky-punch', 'species', 'Raises Chansey\'s critical hit ratio by 2 stages.'),
  e('deep-sea-tooth', 'species', 'Doubles Clamperl\'s Sp. Atk.'),
  e('deep-sea-scale', 'species', 'Doubles Clamperl\'s Sp. Def.'),
  e('soul-dew', 'species', '1.2× Psychic and Dragon moves for Latios/Latias.'),
  e('adamant-orb', 'species', '1.2× Dragon and Steel moves for Dialga.'),
  e('lustrous-orb', 'species', '1.2× Dragon and Water moves for Palkia.'),
  e('griseous-orb', 'species', '1.2× Dragon and Ghost moves for Giratina. Changes to Origin Forme.'),
  e('rusted-sword', 'species', 'Changes Zacian to Crowned Sword forme. Gains Steel type.'),
  e('rusted-shield', 'species', 'Changes Zamazenta to Crowned Shield forme. Gains Steel type.'),

  // ── Misc competitive ──
  e('wide-lens', 'utility', '1.1× accuracy for all moves.'),
  e('zoom-lens', 'utility', '1.2× accuracy if the holder moves after the target.'),
  e('kings-rock', 'utility', '10% flinch chance on damaging moves.'),
  e('bright-powder', 'utility', 'Lowers opponent\'s accuracy by 10%.'),
  e('lax-incense', 'utility', 'Lowers opponent\'s accuracy by 10%.'),
  e('ring-target', 'utility', 'Moves that would have no effect due to type land normally.'),
  e('iron-ball', 'utility', 'Halves Speed and grounds Flying types. Grounds holder.'),
  e('lagging-tail', 'utility', 'Holder always moves last in its priority bracket.'),
  e('quick-claw', 'utility', '20% chance to move first in its priority bracket.'),
  e('absorb-bulb', 'boost', '+1 Sp. Atk when hit by a Water-type move. Single use.'),
  e('cell-battery', 'boost', '+1 Attack when hit by an Electric-type move. Single use.'),
  e('luminous-moss', 'boost', '+1 Sp. Def when hit by a Water-type move. Single use.'),
  e('snowball', 'boost', '+1 Attack when hit by an Ice-type move. Single use.'),
];

export function useItemList(): { items: ItemEntry[]; loading: boolean } {
  return { items: BATTLE_ITEMS, loading: false };
}
