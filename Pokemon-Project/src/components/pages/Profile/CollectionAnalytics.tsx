import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCollection } from '../../../context/CollectionContext';
import { useTypeDistribution } from '../../../hooks/useTypeDistribution';
import { getTypeColor, translateType } from '../Pokedex/utils';

const GENERATION_RANGES = [
  { gen: 1, min: 1,   max: 151  },
  { gen: 2, min: 152, max: 251  },
  { gen: 3, min: 252, max: 386  },
  { gen: 4, min: 387, max: 493  },
  { gen: 5, min: 494, max: 649  },
  { gen: 6, min: 650, max: 721  },
  { gen: 7, min: 722, max: 809  },
  { gen: 8, min: 810, max: 905  },
  { gen: 9, min: 906, max: 1025 },
];

const CollectionAnalytics: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { collectionItems } = useCollection();
  const { typeCounts, loading: typesLoading } = useTypeDistribution(collectionItems);

  const genCounts = useMemo(() => {
    return GENERATION_RANGES.map(({ gen, min, max }) => ({
      gen,
      count: collectionItems.filter(item => item.pokemon_id >= min && item.pokemon_id <= max).length,
    })).filter(g => g.count > 0);
  }, [collectionItems]);

  const maxGenCount = Math.max(...genCounts.map(g => g.count), 1);

  const sortedTypes = useMemo(() => {
    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1]);
  }, [typeCounts]);

  const maxTypeCount = Math.max(...sortedTypes.map(([, c]) => c), 1);

  if (collectionItems.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-6">
        {/* Section title */}
        <div className="flex items-center gap-2 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('analytics_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generation breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t('analytics_gen_breakdown')}
            </h3>
            {genCounts.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">{t('analytics_no_data')}</p>
            ) : (
              <div className="space-y-2">
                {genCounts.map(({ gen, count }) => (
                  <div key={gen} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 shrink-0">
                      {t('analytics_gen')} {gen}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxGenCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-5 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type distribution */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t('analytics_type_dist')}
            </h3>
            {typesLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                {t('analytics_types_loading')}
              </div>
            ) : sortedTypes.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">{t('analytics_no_data')}</p>
            ) : (
              <div className="space-y-1.5">
                {sortedTypes.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-medium text-white px-1.5 py-0.5 rounded-full w-16 text-center shrink-0 ${getTypeColor(type)}`}
                    >
                      {translateType(type, i18n.language)}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getTypeColor(type)}`}
                        style={{ width: `${(count / maxTypeCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-5 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionAnalytics;
