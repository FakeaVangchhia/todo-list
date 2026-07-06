import { createClient } from '@/utils/supabase/client';

export async function signInWithGoogle() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? user?.email
    ?? 'User'
  );
}

export function getAvatarUrl(user) {
  return user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
}
