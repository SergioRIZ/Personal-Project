import React, { useState } from 'react';
import { translateStatName } from '../utils';

interface StatEntry {
  stat: { name: string };
  base_stat: number;
}

interface Props {
  stats: StatEntry[];
  currentLanguage: string;
}

const STAT_BG: Record<string, [string, string]> = {
  'hp':               ['bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-900/40 dark:to-red-900/40',       'bg-rose-50/50 dark:bg-rose-900/20'],
  'attack':           ['bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40', 'bg-amber-50/50 dark:bg-amber-900/20'],
  'defense':          ['bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40', 'bg-yellow-50/50 dark:bg-yellow-900/20'],
  'special-attack':   ['bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40',   'bg-blue-50/50 dark:bg-blue-900/20'],
  'special-defense':  ['bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40', 'bg-emerald-50/50 dark:bg-emerald-900/20'],
  'speed':            ['bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40', 'bg-violet-50/50 dark:bg-violet-900/20'],
};

const BAR_COLORS: Record<string, string> = {
  'hp':               'bg-gradient-to-r from-rose-500 to-red-500',
  'attack':           'bg-gradient-to-r from-amber-500 to-orange-500',
  'defense':          'bg-gradient-to-r from-yellow-500 to-amber-500',
  'special-attack':   'bg-gradient-to-r from-blue-500 to-indigo-500',
  'special-defense':  'bg-gradient-to-r from-emerald-500 to-green-500',
  'speed':            'bg-gradient-to-r from-violet-500 to-purple-500',
};

const TEXT_COLORS: Record<string, string> = {
  'hp':               'text-rose-600 dark:text-rose-400',
  'attack':           'text-amber-600 dark:text-amber-400',
  'defense':          'text-yellow-600 dark:text-yellow-400',
  'special-attack':   'text-blue-600 dark:text-blue-400',
  'special-defense':  'text-emerald-600 dark:text-emerald-400',
  'speed':            'text-violet-600 dark:text-violet-400',
};

const PokemonStats = ({ stats, currentLanguage }: Props) => {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const maxStatValue = Math.max(...stats.map(s => s.base_stat));

  return (
    <div className="backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/40 shadow-sm mx-auto max-w-md">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        {currentLanguage === 'es' ? 'Estadísticas Base' : 'Base Stats'}
      </h3>
      <div className="space-y-3">
        {stats.map(stat => {
          const isMax = stat.base_stat === maxStatValue;
          const [maxBg, normalBg] = STAT_BG[stat.stat.name] ?? ['bg-slate-200', 'bg-slate-100'];
          const barColor = BAR_COLORS[stat.stat.name] ?? 'bg-gradient-to-r from-slate-500 to-gray-500';
          const textColor = TEXT_COLORS[stat.stat.name] ?? 'text-slate-600';
          const isHovered = hoveredStat === stat.stat.name;
          const statPercent = Math.min(100, (stat.base_stat / 255) * 100);

          return (
            <div
              key={stat.stat.name}
              className={`p-3 rounded-lg h-16 transition-all duration-200 ${isHovered ? maxBg : isMax ? maxBg : normalBg} ${isMax ? 'ring-2 ring-offset-1 shadow-md' : ''}`}
              onMouseEnter={() => setHoveredStat(stat.stat.name)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium capitalize ${textColor} ${isMax ? 'font-bold' : ''}`}>
                  {isMax && <span className="mr-1">★</span>}
                  {translateStatName(stat.stat.name, currentLanguage)}
                </span>
                <span className={`text-sm font-bold ${textColor}`}>{stat.base_stat}</span>
              </div>
              <div className="h-2 bg-slate-200/70 dark:bg-slate-700/70 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full ${barColor} transition-all duration-300 ease-out ${isMax ? 'animate-pulse' : ''}`}
                  style={{ width: `${statPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonStats;
