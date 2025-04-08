import React, { useState } from 'react';
import { translateStatName } from '../utils';

const PokemonStats = ({ stats, currentLanguage }) => {
  const [hoveredStat, setHoveredStat] = useState(null);
  
  // Encontrar el valor máximo de estadística para este Pokémon
  const maxStatValue = Math.max(...stats.map(stat => stat.base_stat));
  
  // Función para determinar el color de fondo según el tipo de estadística
  const getStatBgColor = (statName, isMax) => {
    const bgColors = {
      'hp': isMax ? 'bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-900/40 dark:to-red-900/40' : 'bg-rose-50/50 dark:bg-rose-900/20',
      'attack': isMax ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40' : 'bg-amber-50/50 dark:bg-amber-900/20',
      'defense': isMax ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40' : 'bg-yellow-50/50 dark:bg-yellow-900/20',
      'special-attack': isMax ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40' : 'bg-blue-50/50 dark:bg-blue-900/20',
      'special-defense': isMax ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40' : 'bg-emerald-50/50 dark:bg-emerald-900/20',
      'speed': isMax ? 'bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40' : 'bg-violet-50/50 dark:bg-violet-900/20'
    };
    
    return bgColors[statName] || (isMax ? 'bg-gradient-to-r from-slate-200 to-gray-100 dark:from-slate-700/50 dark:to-gray-700/50' : 'bg-slate-100/40 dark:bg-slate-800/40');
  };
  
  // Función para determinar el color de hover según el tipo de estadística
  const getHoverBgColor = (statName) => {
    const hoverColors = {
      'hp': 'bg-rose-100/80 dark:bg-rose-800/30',
      'attack': 'bg-amber-100/80 dark:bg-amber-800/30',
      'defense': 'bg-yellow-100/80 dark:bg-yellow-800/30',
      'special-attack': 'bg-blue-100/80 dark:bg-blue-800/30',
      'special-defense': 'bg-emerald-100/80 dark:bg-emerald-800/30',
      'speed': 'bg-violet-100/80 dark:bg-violet-800/30'
    };
    
    return hoverColors[statName] || 'bg-slate-200/60 dark:bg-slate-700/60';
  };
  
  // Colores modernos para las barras de progreso
  const getModernStatColor = (statName) => {
    const barColors = {
      'hp': 'bg-gradient-to-r from-rose-500 to-red-500',
      'attack': 'bg-gradient-to-r from-amber-500 to-orange-500',
      'defense': 'bg-gradient-to-r from-yellow-500 to-amber-500',
      'special-attack': 'bg-gradient-to-r from-blue-500 to-indigo-500',
      'special-defense': 'bg-gradient-to-r from-emerald-500 to-green-500',
      'speed': 'bg-gradient-to-r from-violet-500 to-purple-500'
    };
    
    return barColors[statName] || 'bg-gradient-to-r from-slate-500 to-gray-500';
  };
  
  return (
    <div className="backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/40 shadow-sm transition-all duration-300 mx-auto max-w-md">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        {currentLanguage === 'es' ? 'Estadísticas Base' : 'Base Stats'}
      </h3>
      <div className="space-y-3">
        {stats.map((stat) => {
          const statName = translateStatName(stat.stat.name, currentLanguage);
          const statPercent = Math.min(100, (stat.base_stat / 255) * 100);
          const modernStatColor = getModernStatColor(stat.stat.name);
          const isMaxStat = stat.base_stat === maxStatValue;
          const statBg = getStatBgColor(stat.stat.name, isMaxStat);
          const hoverBg = getHoverBgColor(stat.stat.name);
          const isHovered = hoveredStat === stat.stat.name;
          
          // Colores de texto modernos según la estadística
          const getTextColor = (statType, isDark = false) => {
            const textColors = {
              'hp': isDark ? 'text-rose-400' : 'text-rose-600',
              'attack': isDark ? 'text-amber-400' : 'text-amber-600',
              'defense': isDark ? 'text-yellow-400' : 'text-yellow-600',
              'special-attack': isDark ? 'text-blue-400' : 'text-blue-600',
              'special-defense': isDark ? 'text-emerald-400' : 'text-emerald-600',
              'speed': isDark ? 'text-violet-400' : 'text-violet-600'
            };
            
            return textColors[statType] || (isDark ? 'text-slate-400' : 'text-slate-600');
          };
          
          return (
            <div 
              key={stat.stat.name} 
              className={`p-3 rounded-lg h-16 transition-all duration-200 ${isHovered ? hoverBg : statBg} ${isMaxStat ? 'ring-2 ring-offset-1 shadow-md' : ''} border border-transparent ${isHovered ? 'border-opacity-60' : 'border-opacity-40'}`}
              onMouseEnter={() => setHoveredStat(stat.stat.name)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium capitalize ${getTextColor(stat.stat.name, false)} dark:${getTextColor(stat.stat.name, true)} transition-colors duration-200 ${isMaxStat ? 'font-bold' : ''}`}>
                  {isMaxStat && <span className="mr-1">★</span>}
                  {statName}
                </span>
                <span className={`text-sm font-bold ${getTextColor(stat.stat.name, false)} dark:${getTextColor(stat.stat.name, true)} transition-colors duration-200`}>
                  {stat.base_stat}
                </span>
              </div>
              <div className={`h-2 bg-slate-200/70 dark:bg-slate-700/70 rounded-full overflow-hidden shadow-inner`}>
                <div 
                  className={`h-full ${modernStatColor} transition-all duration-300 ease-out ${isMaxStat ? 'animate-pulse' : ''}`} 
                  style={{ width: `${statPercent}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonStats;