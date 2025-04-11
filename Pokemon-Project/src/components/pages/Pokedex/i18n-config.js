import i18next from 'i18next';
import { initReactI18next } from '../../../../node_modules/react-i18next';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          loading: "Loading Pokédex...",
          completed: "completed",
          errorTitle: "Error loading Pokédex!",
          title: "National Pokedex",
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
          m: "m",
          kg: "kg",
          startSearching: "Start searching to see Pokémon",
          typeToSearch: "Type the name or number of a Pokémon",
          menu: "Menu",
          closeMenu: "Close menu",
          settings: "Settings",
          teams: "Teams",
          // New translations for Login/Signup
          login: "LOGIN",
          signup: "SIGN-UP"
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
          m: "m",
          kg: "kg",
          startSearching: "Empieza a buscar para ver Pokémon",
          typeToSearch: "Escribe el nombre o número de un Pokémon",
          menu: "Menú",
          closeMenu: "Cerrar menú",
          settings: "Configuración",
          teams: "Equipos",
          // New translations for Login/Signup
          login: "INICIAR SESIÓN",
          signup: "REGISTRARSE"
        }
      }
    },
    lng: "es",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;