export interface PokemonBasic {
  id: number;
  name: string;
  url: string;
}

export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string | null;
    other: { 'official-artwork': { front_default: string; front_shiny: string | null } };
  };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  abilities: Array<{ ability: { name: string; url: string }; is_hidden: boolean }>;
  height: number;
  weight: number;
}

export interface AbilityInfo {
  description: string;
  name: string;
}

export type AbilityMap = Record<string, AbilityInfo>;

export const fetchAbilityDescriptions = async (
  pokemonList: Array<{ abilities: Array<{ ability: { url: string; name: string } }> }>,
  currentLanguage: string
): Promise<AbilityMap> => {
  const abilityUrls = new Set<string>();
  pokemonList.forEach(pokemon => {
    pokemon.abilities.forEach(ability => {
      abilityUrls.add(ability.ability.url);
    });
  });

  const abilityDetails: AbilityMap = {};
  const targetLang = currentLanguage === 'es' ? 'es' : 'en';
  const fallbackLang = targetLang === 'es' ? 'en' : 'es';

  await Promise.all(
    Array.from(abilityUrls).map(async url => {
      const response = await fetch(url);
      const data = await response.json();

      const localized = data.flavor_text_entries.find(
        (e: { language: { name: string }; flavor_text: string }) =>
          e.language.name === targetLang
      );
      const fallback = data.flavor_text_entries.find(
        (e: { language: { name: string }; flavor_text: string }) =>
          e.language.name === fallbackLang
      );

      const description =
        localized?.flavor_text ?? fallback?.flavor_text ?? 'No description available';

      const nameEntry = data.names.find(
        (n: { language: { name: string }; name: string }) => n.language.name === targetLang
      );

      abilityDetails[data.name] = {
        description,
        name: nameEntry?.name ?? (data.name as string).replace('-', ' '),
      };
    })
  );

  return abilityDetails;
};
