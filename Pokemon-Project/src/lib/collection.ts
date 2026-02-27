import { supabase } from './supabase';

export interface CollectionItem {
  pokemon_id: number;
  pokemon_name: string;
  added_at: string;
}

export async function fetchCollection(userId: string): Promise<CollectionItem[]> {
  const { data, error } = await supabase
    .from('user_pokemon')
    .select('pokemon_id, pokemon_name, added_at')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CollectionItem[];
}

export async function addToCollection(
  userId: string,
  pokemonId: number,
  pokemonName: string
): Promise<void> {
  const { error } = await supabase
    .from('user_pokemon')
    .upsert({ user_id: userId, pokemon_id: pokemonId, pokemon_name: pokemonName });

  if (error) throw error;
}

export async function removeFromCollection(
  userId: string,
  pokemonId: number
): Promise<void> {
  const { error } = await supabase
    .from('user_pokemon')
    .delete()
    .eq('user_id', userId)
    .eq('pokemon_id', pokemonId);

  if (error) throw error;
}
