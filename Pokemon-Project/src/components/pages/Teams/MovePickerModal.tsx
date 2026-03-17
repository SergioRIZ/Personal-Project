import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { translateType } from '../Pokedex/utils';

interface Props {
  pokemonId: number;
  pokemonName?: string;  // PokeAPI form name (e.g. "urshifu-rapid-strike")
  currentMoves: string[];
  onSelect: (slug: string) => void;
  onClose: () => void;
}

// Module-level cache — re-opening the picker for the same Pokémon is instant (capped at 100)
const MOVES_CACHE_MAX = 100;
const pokemonMovesCache = new Map<string, string[]>();

function setMovesCache(key: string, value: string[]) {
  if (pokemonMovesCache.size >= MOVES_CACHE_MAX) {
    const firstKey = pokemonMovesCache.keys().next().value!;
    pokemonMovesCache.delete(firstKey);
  }
  pokemonMovesCache.set(key, value);
}

function formatMoveName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Move category sprites
const DAMAGE_CLASS_SPRITE: Record<string, string> = {
  physical: '/move-types/Physic.png',
  special:  '/move-types/Special.png',
  status:   '/move-types/Status.png',
};

// Type icon SVGs
const getTypeIconUrl = (type: string): string =>
  `/icons-types/${type.toLowerCase()}.svg`;

const MovePickerModal: React.FC<Props> = ({ pokemonId, pokemonName, currentMoves, onSelect, onClose }) => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [allMoves, setAllMoves] = useState<string[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Move focus into modal
    modalRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch the Pokémon's learnable move list (use form name when available, fallback to ID)
  const movesCacheKey = pokemonName ?? String(pokemonId);
  useEffect(() => {
    if (pokemonMovesCache.has(movesCacheKey)) {
      setAllMoves(pokemonMovesCache.get(movesCacheKey)!);
      return;
    }
    setLoadingList(true);

    const doFetch = async () => {
      let res: Response;
      if (pokemonName) {
        const clean = pokemonName.replace(/[()]/g, '');
        res = await fetch(`https://pokeapi.co/api/v2/pokemon/${clean}`);
        if (!res.ok) res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      } else {
        res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      }
      const data: { moves: Array<{ move: { name: string } }> } = await res.json();
      const slugs = [...new Set(data.moves.map(m => m.move.name))].sort();
      setMovesCache(movesCacheKey, slugs);
      setAllMoves(slugs);
    };

    doFetch().catch(console.error).finally(() => setLoadingList(false));
  }, [pokemonId, pokemonName, movesCacheKey]);

  // Fetch type/power/category/description for every move (progressive batches of 10)
  const { details: moveDetails } = useMoveDetails(allMoves, i18n.language);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allMoves;
    return allMoves.filter(slug => {
      const localName = moveDetails[slug]?.name?.toLowerCase() ?? '';
      return slug.includes(q) || formatMoveName(slug).toLowerCase().includes(q) || localName.includes(q);
    });
  }, [allMoves, search, moveDetails]);

  const currentSet = useMemo(() => new Set(currentMoves), [currentMoves]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-picker-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] focus:outline-none"
      >

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0">
          <div className="flex-1">
            <h3 id="move-picker-title" className="font-bold text-gray-900 dark:text-white text-base leading-tight">
              {t('teams_pick_move_title')}
            </h3>
            {!loadingList && allMoves.length > 0 && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                {allMoves.length} moves available · {currentMoves.length}/4 selected
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label={t('closeMenu', 'Close')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Search ──────────────────────────────────────────────── */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('teams_move_search')}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* ── Column headers ───────────────────────────────────────── */}
        {!loadingList && allMoves.length > 0 && (
          <div className="px-5 py-1.5 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 shrink-0">
            <span className="w-5 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider shrink-0">Type</span>
            <span className="flex-1 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Move</span>
            <span className="w-8 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider text-center shrink-0">Pwr</span>
            <span className="w-16 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider text-center shrink-0">Cat</span>
          </div>
        )}

        {/* ── Move list ────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1">
          {loadingList ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-label={t('teams_loading_moves')}>
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400 dark:text-gray-500">{t('teams_loading_moves')}</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-400 dark:text-gray-500">{t('noResults')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/80">
              {filtered.map(slug => {
                const selected = currentSet.has(slug);
                const detail = moveDetails[slug];

                return (
                  <button
                    key={slug}
                    onClick={() => { if (!selected) { onSelect(slug); onClose(); } }}
                    disabled={selected}
                    className={`w-full flex flex-col px-5 py-2.5 text-left transition-all duration-100 group ${
                      selected
                        ? 'bg-red-50 dark:bg-red-900/15 cursor-default'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer'
                    }`}
                  >
                    {/* Row 1: Type icon · Name · Power · Category · Checkmark */}
                    <div className="flex items-center gap-3 w-full">
                      {/* Type icon (SVG) */}
                      <div className="shrink-0 w-5">
                        {detail ? (
                          <img
                            src={getTypeIconUrl(detail.type)}
                            alt={translateType(detail.type, i18n.language)}
                            title={translateType(detail.type, i18n.language)}
                            className="w-5 h-5 object-contain drop-shadow"
                          />
                        ) : (
                          <span className="block w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        )}
                      </div>

                      {/* Name */}
                      <p className={`flex-1 min-w-0 text-sm font-semibold leading-snug truncate ${
                        selected
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}>
                        {detail?.name ?? formatMoveName(slug)}
                      </p>

                      {/* Power */}
                      <div className="shrink-0 flex flex-col items-center w-8">
                        {detail ? (
                          <>
                            <span className={`text-sm font-black tabular-nums leading-tight ${
                              detail.power != null
                                ? 'text-gray-700 dark:text-gray-200'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}>
                              {detail.power != null ? detail.power : '—'}
                            </span>
                            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">pwr</span>
                          </>
                        ) : (
                          <span className="w-8 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        )}
                      </div>

                      {/* Category sprite */}
                      <div className="shrink-0 w-16">
                        {detail ? (
                          <img
                            src={DAMAGE_CLASS_SPRITE[detail.damageClass]}
                            alt={detail.damageClass}
                            title={detail.damageClass}
                            className="w-16 h-auto object-contain"
                          />
                        ) : (
                          <span className="w-16 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse block" />
                        )}
                      </div>

                      {/* Selected checkmark */}
                      {selected && (
                        <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Row 2: Description (below the main row) */}
                    {detail ? (
                      detail.shortEffect ? (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 ml-8 leading-relaxed line-clamp-2">
                          {detail.shortEffect}
                        </p>
                      ) : null
                    ) : (
                      <div className="mt-1.5 ml-8 space-y-1">
                        <span className="block w-full h-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <span className="block w-2/3 h-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        {!loadingList && filtered.length > 0 && (
          <div className="shrink-0 px-5 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'move' : 'moves'}{search ? ' found' : ''}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {currentMoves.length}/4 selected
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MovePickerModal;
