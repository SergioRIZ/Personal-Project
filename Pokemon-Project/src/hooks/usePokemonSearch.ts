import { useState, useEffect } from 'react';
import i18next from 'i18next';
import { MEGA_FORMS } from '../lib/megaData';
import { REGIONAL_FORMS } from '../lib/regionalData';
import { GMAX_FORMS } from '../lib/gmaxData';
import { ALT_FORMS } from '../lib/altFormsData';
import { PARADOX_POKEMON } from '../lib/paradoxData';

export type FormType = 'mega' | 'alola' | 'galar' | 'hisui' | 'paldea' | 'gmax' | 'alt';

export interface PokemonEntry {
  id: number;
  name: string;
  megaForm?: string;     // PokeAPI alternate form name (used for ALL form types)
  displayName?: string;  // Localized display name
  formType?: FormType;
}

let allPokemonCache: PokemonEntry[] | null = null;
let cachedLang: string | null = null;

function isSpanish(): boolean {
  return i18next.language?.startsWith('es') ?? false;
}

async function fetchAllPokemon(): Promise<PokemonEntry[]> {
  const lang = isSpanish() ? 'es' : 'en';

  // Invalidate cache if language changed
  if (allPokemonCache && cachedLang === lang) return allPokemonCache;

  const res = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1025');
  const data = await res.json() as { results: Array<{ name: string }> };
  const es = lang === 'es';

  const entries: PokemonEntry[] = [];
  data.results.forEach((p, i) => {
    const id = i + 1;
    const paradox = PARADOX_POKEMON[id];
    entries.push({
      id,
      name: p.name,
      displayName: paradox ? (es ? paradox.nameEs : paradox.nameEn) : undefined,
    });

    // Add mega forms
    const megas = MEGA_FORMS[id];
    if (megas) {
      for (const mega of megas) {
        entries.push({
          id,
          name: p.name,
          megaForm: mega.name,
          displayName: es ? mega.labelEs : mega.label,
          formType: 'mega',
        });
      }
    }

    // Add regional forms
    const regionals = REGIONAL_FORMS[id];
    if (regionals) {
      for (const form of regionals) {
        entries.push({
          id,
          name: p.name,
          megaForm: form.name,
          displayName: es ? form.labelEs : form.label,
          formType: form.region,
        });
      }
    }

    // Add Gigantamax forms
    const gmaxes = GMAX_FORMS[id];
    if (gmaxes) {
      for (const form of gmaxes) {
        entries.push({
          id,
          name: p.name,
          megaForm: form.name,
          displayName: es ? form.labelEs : form.label,
          formType: 'gmax',
        });
      }
    }

    // Add alternate forms (different stats/types)
    const alts = ALT_FORMS[id];
    if (alts) {
      for (const form of alts) {
        entries.push({
          id,
          name: p.name,
          megaForm: form.name,
          displayName: es ? form.labelEs : form.label,
          formType: 'alt',
        });
      }
    }
  });

  allPokemonCache = entries;
  cachedLang = lang;
  return allPokemonCache;
}

export function usePokemonSearch() {
  const [allPokemon, setAllPokemon] = useState<PokemonEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Re-fetch when language changes to update displayNames
    const load = () => {
      fetchAllPokemon()
        .then(list => { setAllPokemon(list); setLoading(false); })
        .catch(() => setLoading(false));
    };

    load();

    const handleLanguageChange = () => {
      allPokemonCache = null; // Invalidate cache
      load();
    };

    i18next.on('languageChanged', handleLanguageChange);
    return () => { i18next.off('languageChanged', handleLanguageChange); };
  }, []);

  return { allPokemon, loading };
}
