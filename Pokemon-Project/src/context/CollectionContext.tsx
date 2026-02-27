import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchCollection,
  addToCollection,
  removeFromCollection,
  type CollectionItem,
} from '../lib/collection';

interface CollectionContextValue {
  collectedIds: Set<number>;
  collectionItems: CollectionItem[];
  loading: boolean;
  addPokemon: (id: number, name: string) => Promise<void>;
  removePokemon: (id: number) => Promise<void>;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCollectionItems([]);
      return;
    }
    setLoading(true);
    fetchCollection(user.id)
      .then(setCollectionItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const collectedIds = new Set(collectionItems.map(item => item.pokemon_id));

  const addPokemon = async (id: number, name: string) => {
    if (!user) return;
    // Optimistic update
    const newItem: CollectionItem = {
      pokemon_id: id,
      pokemon_name: name,
      added_at: new Date().toISOString(),
    };
    setCollectionItems(prev => [newItem, ...prev]);
    try {
      await addToCollection(user.id, id, name);
    } catch (err) {
      // Rollback on error
      setCollectionItems(prev => prev.filter(item => item.pokemon_id !== id));
      console.error(err);
    }
  };

  const removePokemon = async (id: number) => {
    if (!user) return;
    // Optimistic update
    setCollectionItems(prev => prev.filter(item => item.pokemon_id !== id));
    try {
      await removeFromCollection(user.id, id);
    } catch (err) {
      // Rollback: re-fetch to restore state
      fetchCollection(user.id).then(setCollectionItems).catch(console.error);
      console.error(err);
    }
  };

  return (
    <CollectionContext.Provider value={{ collectedIds, collectionItems, loading, addPokemon, removePokemon }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection(): CollectionContextValue {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider');
  return ctx;
}
