import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sdk } from '@/server/_core/sdk';
import { getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/admin/login?error=invalid_callback', request.url)
      );
    }

    // Exchange code for token
    const token = await sdk.exchangeCodeForToken(code, state);
    const userInfo = await sdk.getUserInfo(token.accessToken);

    // Upsert user to database
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    const [user] = await db
      .insert(users)
      .values({
        openId: userInfo.openId,
        email: userInfo.email,
        name: userInfo.name,
        role: userInfo.openId === process.env.OWNER_OPEN_ID ? 'admin' : 'user',
      })
      .onConflictDoUpdate({
        target: users.openId,
        set: {
          email: userInfo.email,
          name: userInfo.name,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Create session token
    const sessionToken = await sdk.createSessionToken(user.openId, {
      name: user.name || undefined,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.redirect(new URL('/admin', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/admin/login?error=auth_failed', request.url)
    );
  }
}
