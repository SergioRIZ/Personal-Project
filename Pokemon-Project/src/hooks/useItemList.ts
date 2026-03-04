import { useState, useEffect } from 'react';

export interface ItemEntry {
  slug: string;
  name: string;
}

let itemListCache: ItemEntry[] | null = null;
let fetchPromise: Promise<ItemEntry[]> | null = null;

function formatSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function fetchAllItems(): Promise<ItemEntry[]> {
  const res = await fetch('https://pokeapi.co/api/v2/item?limit=2000');
  if (!res.ok) throw new Error('Failed to fetch items');
  const data = await res.json() as { results: Array<{ name: string }> };
  return data.results.map(r => ({ slug: r.name, name: formatSlug(r.name) }));
}

export function useItemList(): { items: ItemEntry[]; loading: boolean } {
  const [items, setItems] = useState<ItemEntry[]>(itemListCache ?? []);
  const [loading, setLoading] = useState(!itemListCache);

  useEffect(() => {
    if (itemListCache) {
      setItems(itemListCache);
      setLoading(false);
      return;
    }

    let cancelled = false;

    if (!fetchPromise) {
      fetchPromise = fetchAllItems();
    }

    fetchPromise
      .then(list => {
        itemListCache = list;
        fetchPromise = null;
        if (!cancelled) {
          setItems(list);
          setLoading(false);
        }
      })
      .catch(err => {
        fetchPromise = null;
        if (!cancelled) setLoading(false);
        console.error(err);
      });

    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}
