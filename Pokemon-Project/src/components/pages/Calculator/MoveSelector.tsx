import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { translateType } from '../Pokedex/utils';

interface Props {
  moves: string[];
  lang: string;
  selectedMove: string | null;
  onSelect: (slug: string | null) => void;
}

const DAMAGE_CLASS_SPRITE: Record<string, string> = {
  physical: '/move-types/Physic.png',
  special:  '/move-types/Special.png',
};

const getTypeIconUrl = (type: string) => `/icons-types/${type.toLowerCase()}.svg`;

function formatMoveName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const MoveSelector = ({ moves, lang, selectedMove, onSelect }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { details } = useMoveDetails(moves, lang);

  // Only show damaging moves
  const damagingMoves = useMemo(() =>
    moves.filter(slug => {
      const d = details[slug];
      return d ? (d.damageClass === 'physical' || d.damageClass === 'special') && d.power : true;
    }),
  [moves, details]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return damagingMoves;
    return damagingMoves.filter(slug => {
      const d = details[slug];
      return slug.includes(q) || (d?.name?.toLowerCase().includes(q)) || formatMoveName(slug).toLowerCase().includes(q);
    });
  }, [damagingMoves, search, details]);

  const selectedDetail = selectedMove ? details[selectedMove] : null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        {t('calc_move', 'Move')}
      </label>

      {/* Selected move preview */}
      {selectedDetail && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-card-alt)] border border-[var(--color-border)]">
          <img src={getTypeIconUrl(selectedDetail.type)} alt={selectedDetail.type} className="w-5 h-5 object-contain" />
          <span className="text-sm font-bold text-[var(--text-primary)] flex-1" style={{ fontFamily: 'var(--font-display)' }}>
            {selectedDetail.name}
          </span>
          {selectedDetail.power && (
            <span className="text-xs font-bold text-[var(--text-muted)] tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
              {selectedDetail.power} pw
            </span>
          )}
          {DAMAGE_CLASS_SPRITE[selectedDetail.damageClass] && (
            <img src={DAMAGE_CLASS_SPRITE[selectedDetail.damageClass]} alt={selectedDetail.damageClass} className="w-14 h-auto object-contain" />
          )}
          <button
            onClick={() => onSelect(null)}
            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[var(--color-border)] text-[var(--text-muted)] transition-colors cursor-pointer"
            aria-label="Clear move"
          >
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      )}

      {/* Search + list */}
      {!selectedMove && (
        <>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('calc_search_move', 'Search move...')}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-card-alt)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
            />
          </div>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]/30">
            {filtered.length === 0 && moves.length > 0 && (
              <div className="text-center py-4 text-xs text-[var(--text-muted)]">
                {Object.keys(details).length === 0 ? t('calc_loading_moves', 'Loading moves...') : t('noResults')}
              </div>
            )}
            {moves.length === 0 && (
              <div className="text-center py-4 text-xs text-[var(--text-muted)]">
                {t('calc_select_attacker', 'Select an attacker first')}
              </div>
            )}
            {filtered.slice(0, 50).map(slug => {
              const d = details[slug];
              return (
                <button
                  key={slug}
                  onClick={() => { onSelect(slug); setSearch(''); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--color-card-alt)] transition-colors cursor-pointer"
                >
                  {d ? (
                    <>
                      <img src={getTypeIconUrl(d.type)} alt={translateType(d.type, lang)} className="w-4 h-4 object-contain shrink-0" />
                      <span className="text-xs font-bold text-[var(--text-primary)] flex-1 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                        {d.name}
                      </span>
                      {d.power && (
                        <span className="text-[10px] font-bold text-[var(--text-muted)] tabular-nums shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                          {d.power}
                        </span>
                      )}
                      {DAMAGE_CLASS_SPRITE[d.damageClass] && (
                        <img src={DAMAGE_CLASS_SPRITE[d.damageClass]} alt={d.damageClass} className="w-12 h-auto object-contain shrink-0" />
                      )}
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{formatMoveName(slug)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MoveSelector;
