import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for storage operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback to anon if service key missing, though anon might not have write access depending on policies. ideally use service role.
);

export async function POST(request: NextRequest) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // specific bucket name? 'products'?
        const bucket = 'products';

        // Ensure bucket exists
        const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.getBucket(bucket);
        if (bucketError) {
            // If getBucket fails, try creating it (assuming it doesn't exist or we have permissions)
            // Note: getBucket might return error if it doesn't exist.
            const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
                public: true,
                fileSizeLimit: 10485760, // 10MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
            });
            if (createError) {
                console.warn('Failed to create bucket (might already exist or permission issue):', createError);
            }
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabaseAdmin.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error('Supabase storage upload error:', error);
            return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
