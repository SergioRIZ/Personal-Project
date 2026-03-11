import { supabase } from './supabase';

export interface AuthError {
  message: string;
}

export async function signIn(
  email: string,
  password: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? { message: error.message } : null };
}

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  return { error: error ? { message: error.message } : null };
}

export async function signInWithGoogle(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { error: error ? { message: error.message } : null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function updateAvatar(avatarId: string | null): Promise<void> {
  await supabase.auth.updateUser({
    data: { avatar_id: avatarId },
  });
}
