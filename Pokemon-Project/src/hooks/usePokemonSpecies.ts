import { useState, useEffect } from 'react';

export interface PokemonSpeciesData {
  description: string;
  genus: string;
  genderRate: number; // -1 = genderless, 0 = always male, 8 = always female
}

// Module-level cache — survives component remounts
// Key: `${id}-${lang}` since description/genus are language-dependent
const speciesCache = new Map<string, PokemonSpeciesData>();

export function usePokemonSpecies(
  pokemonId: number | null,
  language: string,
): { species: PokemonSpeciesData | null; loading: boolean } {
  const cacheKey = pokemonId != null ? `${pokemonId}-${language}` : '';
  const [species, setSpecies] = useState<PokemonSpeciesData | null>(
    cacheKey ? (speciesCache.get(cacheKey) ?? null) : null,
  );
  const [loading, setLoading] = useState(
    pokemonId != null && !speciesCache.has(cacheKey),
  );

  useEffect(() => {
    if (pokemonId === null) return;

    const key = `${pokemonId}-${language}`;
    if (speciesCache.has(key)) {
      setSpecies(speciesCache.get(key)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const targetLang = language === 'es' ? 'es' : 'en';
    const fallbackLang = targetLang === 'es' ? 'en' : 'es';

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
      .then(r => r.json())
      .then(
        (data: {
          flavor_text_entries: Array<{
            flavor_text: string;
            language: { name: string };
          }>;
          genera: Array<{ genus: string; language: { name: string } }>;
          gender_rate: number;
        }) => {
          if (cancelled) return;

          // Description — prefer target language, fallback
          const flavorEntry =
            data.flavor_text_entries.find(e => e.language.name === targetLang) ??
            data.flavor_text_entries.find(e => e.language.name === fallbackLang);
          const description = flavorEntry
            ? flavorEntry.flavor_text.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim()
            : '';

          // Genus / category
          const genusEntry =
            data.genera.find(g => g.language.name === targetLang) ??
            data.genera.find(g => g.language.name === fallbackLang);
          const genus = genusEntry?.genus ?? '';

          const result: PokemonSpeciesData = {
            description,
            genus,
            genderRate: data.gender_rate,
          };

          speciesCache.set(key, result);
          setSpecies(result);
          setLoading(false);
        },
      )
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pokemonId, language]);

  return { species, loading };
}
