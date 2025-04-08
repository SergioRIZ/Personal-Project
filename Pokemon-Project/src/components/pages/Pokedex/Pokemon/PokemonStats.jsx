import React, { useState } from 'react';
import { getStatColor, translateStatName } from '../utils';

const PokemonStats = ({ stats, currentLanguage }) => {
  const [hoveredStat, setHoveredStat] = useState(null);
  
  // Función para determinar el color de fondo según el valor de la estadística
  const getStatBgColor = (baseValue) => {
    const percentage = Math.min(100, (baseValue / 255) * 100);
    if (percentage >= 70) return 'bg-emerald-500/20 dark:bg-emerald-500/30';
    if (percentage >= 40) return 'bg-amber-500/20 dark:bg-amber-500/30';
    return 'bg-rose-500/20 dark:bg-rose-500/30';
  };
  
  // Función para determinar el color de hover según el valor de la estadística
  const getHoverBgColor = (baseValue) => {
    const percentage = Math.min(100, (baseValue / 255) * 100);
    if (percentage >= 70) return 'bg-emerald-500/30 dark:bg-emerald-500/40';
    if (percentage >= 40) return 'bg-amber-500/30 dark:bg-amber-500/40';
    return 'bg-rose-500/30 dark:bg-rose-500/40';
  };
  
  return (
    <div className="backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/40 shadow-sm transition-all duration-300">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        {currentLanguage === 'es' ? 'Estadísticas Base' : 'Base Stats'}
      </h3>
      <div className="space-y-3">
        {stats.map((stat) => {
          const statName = translateStatName(stat.stat.name, currentLanguage);
          const statPercent = Math.min(100, (stat.base_stat / 255) * 100);
          const statColor = getStatColor(stat.stat.name);
          const statBg = getStatBgColor(stat.base_stat);
          const hoverBg = getHoverBgColor(stat.base_stat);
          const isHovered = hoveredStat === stat.stat.name;
          
          return (
            <div 
              key={stat.stat.name} 
              className={`p-3 rounded-lg h-16 transition-colors duration-200 ${isHovered ? hoverBg : statBg} border border-transparent ${isHovered ? 'border-slate-300/30 dark:border-slate-600/30' : ''}`}
              onMouseEnter={() => setHoveredStat(stat.stat.name)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium capitalize text-slate-700 dark:text-slate-300 transition-colors duration-200 ${isHovered ? 'text-slate-900 dark:text-white' : ''}`}>
                  {statName}
                </span>
                <span className={`text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors duration-200 ${isHovered ? 'text-slate-900 dark:text-white' : ''}`}>
                  {stat.base_stat}
                </span>
              </div>
              <div className="h-2 bg-slate-200/70 dark:bg-slate-700/70 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${statColor} shadow-inner transition-all duration-300 ease-out ${isHovered ? 'ring-1 ring-white/30' : ''}`} 
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