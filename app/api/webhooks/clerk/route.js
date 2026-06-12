import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;
    const supabase = createSupabaseServerClient();

    try {
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const email = evt.data.email_addresses?.[0]?.email_address;
            // Extract custom role and organization from Clerk's public_metadata
            const role = evt.data.public_metadata?.role || 'candidate';
            const organization_id = evt.data.public_metadata?.organization_id || null;

            const full_name = evt.data.first_name ? `${evt.data.first_name} ${evt.data.last_name || ''}`.trim() : null;
            const avatar_url = evt.data.image_url || null;

            if (!email) {
                return new Response('Error: No email address', { status: 400 });
            }

            await supabase.from('users').upsert({
                id,
                email,
                role,
                organization_id,
                full_name,
                avatar_url,
                // Using JS Date to ensure Clerk's millis translate correctly to Postgres TIMESTAMP
                created_at: new Date(evt.data.created_at).toISOString()
            }, { onConflict: 'id' });
        }

        if (eventType === 'user.deleted') {
            await supabase.from('users').delete().eq('id', id);
        }
    } catch (dbError) {
        console.error('Database Sync Error:', dbError);
        return new Response('Error syncing to database', { status: 500 });
    }

    return new Response('', { status: 200 });
}
