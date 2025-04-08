export const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-400 border-gray-500',
      fire: 'bg-red-500 border-red-600',
      water: 'bg-blue-500 border-blue-600',
      electric: 'bg-yellow-400 border-yellow-500',
      grass: 'bg-green-500 border-green-600',
      ice: 'bg-blue-200 border-blue-300',
      fighting: 'bg-red-700 border-red-800',
      poison: 'bg-purple-500 border-purple-600',
      ground: 'bg-yellow-700 border-yellow-800',
      flying: 'bg-indigo-300 border-indigo-400',
      psychic: 'bg-pink-500 border-pink-600',
      bug: 'bg-green-600 border-green-700',
      rock: 'bg-yellow-800 border-yellow-900',
      ghost: 'bg-purple-700 border-purple-800',
      dragon: 'bg-indigo-700 border-indigo-800',
      dark: 'bg-gray-800 border-gray-900',
      steel: 'bg-gray-500 border-gray-600',
      fairy: 'bg-pink-300 border-pink-400'
    };
    
    return typeColors[type] || 'bg-gray-400 border-gray-500';
  };
  
  // Función para obtener el color del stat
export const getStatColor = (statName) => {
  const statColors = {
    'hp': 'bg-gradient-to-r from-rose-500 to-rose-600',
    'attack': 'bg-gradient-to-r from-orange-500 to-orange-600',
    'defense': 'bg-gradient-to-r from-amber-500 to-amber-600',
    'special-attack': 'bg-gradient-to-r from-blue-500 to-indigo-600',
    'special-defense': 'bg-gradient-to-r from-emerald-500 to-green-600',
    'speed': 'bg-gradient-to-r from-purple-500 to-violet-600'
  };
  
  return statColors[statName] || 'bg-gradient-to-r from-gray-500 to-gray-600';
};
  
  // Función para traducir nombres de stats
  export const translateStatName = (statName, currentLanguage) => {
    const statTranslations = {
      'hp': 'HP',
      'attack': currentLanguage === 'es' ? 'Ataque' : 'Attack',
      'defense': currentLanguage === 'es' ? 'Defensa' : 'Defense',
      'special-attack': currentLanguage === 'es' ? 'Ataque Esp.' : 'Sp. Attack',
      'special-defense': currentLanguage === 'es' ? 'Defensa Esp.' : 'Sp. Defense',
      'speed': currentLanguage === 'es' ? 'Velocidad' : 'Speed'
    };
    
    return statTranslations[statName] || statName.replace('-', ' ');
  };
  
  // Traducir tipos de Pokémon
  export const translateType = (type, currentLanguage) => {
    const typeTranslations = {
      'normal': currentLanguage === 'es' ? 'normal' : 'normal',
      'fire': currentLanguage === 'es' ? 'fuego' : 'fire',
      'water': currentLanguage === 'es' ? 'agua' : 'water',
      'electric': currentLanguage === 'es' ? 'eléctrico' : 'electric',
      'grass': currentLanguage === 'es' ? 'planta' : 'grass',
      'ice': currentLanguage === 'es' ? 'hielo' : 'ice',
      'fighting': currentLanguage === 'es' ? 'lucha' : 'fighting',
      'poison': currentLanguage === 'es' ? 'veneno' : 'poison',
      'ground': currentLanguage === 'es' ? 'tierra' : 'ground',
      'flying': currentLanguage === 'es' ? 'volador' : 'flying',
      'psychic': currentLanguage === 'es' ? 'psíquico' : 'psychic',
      'bug': currentLanguage === 'es' ? 'bicho' : 'bug',
      'rock': currentLanguage === 'es' ? 'roca' : 'rock',
      'ghost': currentLanguage === 'es' ? 'fantasma' : 'ghost',
      'dragon': currentLanguage === 'es' ? 'dragón' : 'dragon',
      'dark': currentLanguage === 'es' ? 'siniestro' : 'dark',
      'steel': currentLanguage === 'es' ? 'acero' : 'steel',
      'fairy': currentLanguage === 'es' ? 'hada' : 'fairy'
    };
    
    return typeTranslations[type] || type;
  };