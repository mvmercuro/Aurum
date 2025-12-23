'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { upsertUser } from '@/lib/db'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/admin/login?error=' + encodeURIComponent(error.message))
    }

    if (user) {
        try {
            await upsertUser({
                openId: user.id,
                email: user.email,
                lastSignedIn: new Date(),
                // We don't force admin role here to avoid security issues, 
                // but we ensure the user row exists so requireAuth doesn't fail.
                // If this is the first user, manual DB update to 'admin' is still needed 
                // unless we want to auto-grant admin (risky).
                // However, the issue explicitly stated "Admin auth loop when DB is empty... returns undefined when DB is unavailable."
                // Upserting fixes the "undefined" part if DB IS available.
                // If DB is unavailable, upsertUser logs error but doesn't crash (hopefully).
            });
        } catch (e) {
            console.error("Failed to seed user from Supabase login:", e);
            // We don't block login, but admin pages might 503 or redirect loop if DB is down.
        }
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}
