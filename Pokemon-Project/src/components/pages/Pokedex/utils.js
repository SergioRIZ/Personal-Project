export const getTypeColor = (type) => {
  const typeColors = {
    normal: 'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-500 shadow-inner',
    fire: 'bg-gradient-to-r from-red-500 to-orange-500 border-red-600 shadow-inner',
    water: 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-600 shadow-inner',
    electric: 'bg-gradient-to-r from-yellow-400 to-amber-400 border-yellow-500 shadow-inner',
    grass: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-600 shadow-inner',
    ice: 'bg-gradient-to-r from-blue-200 to-cyan-300 border-blue-300 shadow-inner',
    fighting: 'bg-gradient-to-r from-red-700 to-red-800 border-red-800 shadow-inner',
    poison: 'bg-gradient-to-r from-purple-500 to-violet-500 border-purple-600 shadow-inner',
    ground: 'bg-gradient-to-r from-yellow-700 to-amber-700 border-yellow-800 shadow-inner',
    flying: 'bg-gradient-to-r from-indigo-300 to-sky-300 border-indigo-400 shadow-inner',
    psychic: 'bg-gradient-to-r from-pink-500 to-fuchsia-500 border-pink-600 shadow-inner',
    bug: 'bg-gradient-to-r from-green-600 to-lime-600 border-green-700 shadow-inner',
    rock: 'bg-gradient-to-r from-yellow-800 to-amber-800 border-yellow-900 shadow-inner',
    ghost: 'bg-gradient-to-r from-purple-700 to-violet-700 border-purple-800 shadow-inner',
    dragon: 'bg-gradient-to-r from-indigo-700 to-blue-700 border-indigo-800 shadow-inner',
    dark: 'bg-gradient-to-r from-gray-800 to-slate-800 border-gray-900 shadow-inner',
    steel: 'bg-gradient-to-r from-gray-500 to-slate-500 border-gray-600 shadow-inner',
    fairy: 'bg-gradient-to-r from-pink-300 to-rose-300 border-pink-400 shadow-inner'
  };
    
  return typeColors[type] || 'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-500 shadow-inner';
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