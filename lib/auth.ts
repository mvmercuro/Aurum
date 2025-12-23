import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserByOpenId } from '@/lib/db';
import type { User } from '@/drizzle/schema';

/**
 * Get the current authenticated user from Supabase Auth
 * Returns null if no valid session exists
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (error || !authUser) {
      return null;
    }

    // Get user from database using the Supabase User ID (which maps to openId in existing schema)
    const user = await getUserByOpenId(authUser.id);
    return user || null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in Server Components that require authentication
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}

/**
 * Require admin role - redirects to home if not admin
 * Use this in Server Components that require admin access
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();

  if (user.role !== 'admin') {
    // Redirect to home if logged in but not admin
    redirect('/');
  }

  return user;
}

/**
 * Check if user is authenticated (without redirecting)
 * Useful for conditional rendering
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

/**
 * Check if user is admin (without redirecting)
 * Useful for conditional rendering
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === 'admin';
}
