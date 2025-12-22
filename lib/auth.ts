import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sdk } from '@/server/_core/sdk';
import { getUserByOpenId } from '@/lib/db';
import type { User } from '@/drizzle/schema';

/**
 * Get the current authenticated user from the session cookie
 * Returns null if no valid session exists
 */
export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return null;
    }

    // Verify session
    const session = await sdk.verifySession(sessionCookie.value);
    if (!session) {
      return null;
    }

    // Get user from database
    const user = await getUserByOpenId(session.openId);
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
