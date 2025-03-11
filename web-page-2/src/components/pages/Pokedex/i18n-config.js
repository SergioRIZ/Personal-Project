import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18next with translations
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          loading: "Loading Pokédex...",
          completed: "completed",
          errorTitle: "Error loading Pokédex!",
          title: "National Pokédex",
          searchPlaceholder: "Search by name or number...",
          showing: "Showing",
          of: "of",
          pokemon: "Pokémon",
          baseStats: "Base Stats",
          height: "Height",
          weight: "Weight",
          abilities: "Abilities",
          hidden: "Hidden",
          noResults: "No Pokémon found",
          tryAgain: "Try another search term",
          dataProvided: "Data provided by",
          m: "m",
          kg: "kg"
        }
      },
      es: {
        translation: {
          loading: "Cargando Pokédex...",
          completed: "completado",
          errorTitle: "¡Error al cargar la Pokédex!",
          title: "Pokédex Nacional",
          searchPlaceholder: "Buscar por nombre o número...",
          showing: "Mostrando",
          of: "de",
          pokemon: "Pokémon",
          baseStats: "Estadísticas base",
          height: "Altura",
          weight: "Peso",
          abilities: "Habilidades",
          hidden: "Oculta",
          noResults: "No se encontraron Pokémon",
          tryAgain: "Intenta con otro término de búsqueda",
          dataProvided: "Datos proporcionados por",
          m: "m",
          kg: "kg"
        }
      }
    },
    lng: "es", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;