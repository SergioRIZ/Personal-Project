import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePokemonSearch, type PokemonEntry } from '../../../hooks/usePokemonSearch';

interface Props {
  value: PokemonEntry | null;
  onSelect: (pokemon: PokemonEntry) => void;
  placeholder?: string;
}

const SPRITE_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

function getDisplayName(p: PokemonEntry): string {
  return (p.displayName ?? p.name).replace(/-/g, ' ');
}

const PokemonSearchInput = ({ value, onSelect, placeholder = 'Search Pokémon...' }: Props) => {
  const { t } = useTranslation();
  const { allPokemon } = usePokemonSearch();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? allPokemon.filter(p => {
        const q = query.toLowerCase();
        const display = getDisplayName(p).toLowerCase();
        return display.includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.id.toString().includes(q) ||
          (p.megaForm && p.megaForm.toLowerCase().includes(q));
      }).slice(0, 30)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setHighlightIdx(0); }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); onSelect(filtered[highlightIdx]); setQuery(''); setIsOpen(false); }
    if (e.key === 'Escape') setIsOpen(false);
  }, [isOpen, filtered, highlightIdx, onSelect]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[highlightIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightIdx]);

  return (
    <div ref={wrapperRef} className="relative">
      {value ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-card-alt)] border border-[var(--color-border)]">
          <img src={SPRITE_URL(value.id)} alt="" className="w-7 h-7 object-contain" loading="lazy" />
          <span className="text-sm font-bold capitalize text-[var(--text-primary)] flex-1" style={{ fontFamily: 'var(--font-display)' }}>
            {getDisplayName(value)}
          </span>
          {value.megaForm && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-gradient-to-r from-amber-500 to-pink-500 text-white">
              {t('calc_mega', 'Mega').toUpperCase()}
            </span>
          )}
          <span className="text-[10px] font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            #{value.id.toString().padStart(4, '0')}
          </span>
          <button
            onClick={() => { onSelect(null as unknown as PokemonEntry); setQuery(''); }}
            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[var(--color-border)] text-[var(--text-muted)] transition-colors cursor-pointer"
            aria-label="Clear selection"
          >
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => query && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-card-alt)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
          />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 top-full mt-1 w-full max-h-56 overflow-y-auto rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl"
          role="listbox"
        >
          {filtered.map((p, i) => (
            <button
              key={p.megaForm ? `${p.id}-${p.megaForm}` : p.id}
              role="option"
              aria-selected={i === highlightIdx}
              onClick={() => { onSelect(p); setQuery(''); setIsOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer ${
                i === highlightIdx
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'hover:bg-[var(--color-card-alt)] text-[var(--text-primary)]'
              }`}
            >
              <img src={SPRITE_URL(p.id)} alt="" className={`w-6 h-6 object-contain ${p.megaForm ? 'saturate-150 hue-rotate-15' : ''}`} loading="lazy" />
              <span className="text-sm font-semibold capitalize flex-1 truncate">{getDisplayName(p)}</span>
              {p.megaForm && (
                <span className="px-1 py-0.5 rounded text-[7px] font-black uppercase bg-gradient-to-r from-amber-500 to-pink-500 text-white shrink-0">
                  {t('calc_mega', 'Mega').toUpperCase()}
                </span>
              )}
              <span className="text-[10px] font-bold text-[var(--text-muted)] shrink-0" style={{ fontFamily: 'var(--font-display)' }}>
                #{p.id.toString().padStart(4, '0')}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonSearchInput;
