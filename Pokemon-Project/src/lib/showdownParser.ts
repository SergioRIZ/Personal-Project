import type { TeamMemberInput, EVSpread, IVSpread } from './teams';
import { NATURES } from './natures';

const STAT_MAP: Record<string, keyof EVSpread> = {
  HP: 'hp', Atk: 'atk', Def: 'def', SpA: 'spa', SpD: 'spd', Spe: 'spe',
};

const DEFAULT_EVS: EVSpread = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
const DEFAULT_IVS: IVSpread = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

const NATURE_NAMES = new Set<string>(NATURES.map(([n]) => n));

export interface ParsedShowdownMon {
  name: string;       // Pokemon name as written (display name, may need resolving)
  item: string | null;
  ability: string | null;
  nature: string | null;
  evs: EVSpread;
  ivs: IVSpread;
  moves: string[];
}

/**
 * Parse a single Showdown set block (lines for one Pokemon).
 */
function parseOneSet(block: string): ParsedShowdownMon | null {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // First line: "Name @ Item" or "Nickname (Name) @ Item" or just "Name"
  const firstLine = lines[0];
  let name: string;
  let item: string | null = null;

  const atIdx = firstLine.lastIndexOf(' @ ');
  const rawName = atIdx !== -1 ? firstLine.slice(0, atIdx).trim() : firstLine.trim();
  if (atIdx !== -1) item = firstLine.slice(atIdx + 3).trim();

  // Handle "Nickname (Species)" format
  const parenMatch = rawName.match(/^.+\(([^)]+)\)\s*$/);
  name = parenMatch ? parenMatch[1].trim() : rawName;

  // Remove gender suffix like " (M)" or " (F)" from name
  name = name.replace(/\s*\([MF]\)\s*$/, '').trim();

  let ability: string | null = null;
  let nature: string | null = null;
  const evs = { ...DEFAULT_EVS };
  const ivs = { ...DEFAULT_IVS };
  const moves: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('Ability:')) {
      ability = line.slice('Ability:'.length).trim();
      continue;
    }

    if (line.startsWith('EVs:')) {
      parseStatLine(line.slice('EVs:'.length), evs);
      continue;
    }

    if (line.startsWith('IVs:')) {
      parseStatLine(line.slice('IVs:'.length), ivs);
      continue;
    }

    // Nature line: "Adamant Nature"
    const natureMatch = line.match(/^(\w+)\s+Nature$/i);
    if (natureMatch) {
      const n = natureMatch[1].charAt(0).toUpperCase() + natureMatch[1].slice(1).toLowerCase();
      if (NATURE_NAMES.has(n)) nature = n;
      continue;
    }

    // Move line: "- Move Name"
    if (line.startsWith('-')) {
      const moveName = line.slice(1).trim();
      if (moveName) moves.push(moveName);
      continue;
    }
  }

  return { name, item, ability, nature, evs, ivs, moves: moves.slice(0, 4) };
}

function parseStatLine(raw: string, target: EVSpread | IVSpread) {
  const parts = raw.split('/');
  for (const part of parts) {
    const m = part.trim().match(/^(\d+)\s+(\w+)$/);
    if (m) {
      const val = parseInt(m[1], 10);
      const stat = STAT_MAP[m[2]];
      if (stat) target[stat] = val;
    }
  }
}

/**
 * Parse full Showdown paste text into an array of parsed sets.
 */
export function parseShowdownText(text: string): ParsedShowdownMon[] {
  // Split by double newlines (each Pokemon is separated by a blank line)
  const blocks = text.split(/\n\s*\n/);
  const results: ParsedShowdownMon[] = [];

  for (const block of blocks) {
    const parsed = parseOneSet(block.trim());
    if (parsed) results.push(parsed);
  }

  return results.slice(0, 6); // Max 6 Pokemon per team
}

/**
 * Convert a display name to a PokeAPI slug.
 * "Iron Valiant" → "iron-valiant", "Tapu Koko" → "tapu-koko"
 */
export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Resolve a parsed Showdown mon to a TeamMemberInput by looking up the PokeAPI.
 * Returns null if the Pokemon can't be found.
 */
export async function resolveShowdownMon(
  parsed: ParsedShowdownMon,
  slot: number,
): Promise<TeamMemberInput | null> {
  const slug = nameToSlug(parsed.name);

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();

    const pokemonId: number = data.id;
    const pokemonName: string = data.name;
    const pokemonTypes: string[] = (data.types as Array<{ type: { name: string } }>)
      .map(t => t.type.name);

    // Convert moves to slugs
    const moveSlugs = parsed.moves.map(nameToSlug);

    // Convert ability to slug
    const abilitySlug = parsed.ability ? nameToSlug(parsed.ability) : null;

    // Convert item to slug
    const itemSlug = parsed.item ? nameToSlug(parsed.item) : null;

    // Check if EVs/IVs differ from defaults
    const hasCustomEvs = Object.values(parsed.evs).some(v => v !== 0);
    const hasCustomIvs = Object.values(parsed.ivs).some(v => v !== 31);

    return {
      pokemon_id: pokemonId,
      pokemon_name: pokemonName,
      pokemon_types: pokemonTypes,
      slot,
      moves: moveSlugs,
      ability: abilitySlug,
      item: itemSlug,
      nature: parsed.nature ?? null,
      evs: hasCustomEvs ? parsed.evs : null,
      ivs: hasCustomIvs ? parsed.ivs : null,
    };
  } catch {
    return null;
  }
}
