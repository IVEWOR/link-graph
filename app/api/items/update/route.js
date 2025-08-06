// app/api/items/update/route.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Initialize a server-side Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Use the service role key for server-side operations
    { auth: { persistSession: false } }
);

export async function POST(request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
        return NextResponse.json({ success: false, error: 'Not authenticated: No token provided' }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
        return NextResponse.json({ success: false, error: `Authentication error: ${userError?.message}` }, { status: 401 });
    }

    try {
        const { itemId, title, linkUrl, category } = await request.json();

        if (!itemId || !title) {
            return NextResponse.json({ success: false, error: 'Item ID and title are required' }, { status: 400 });
        }

        const itemToUpdate = await prisma.item.findUnique({ where: { id: itemId } });
        if (!itemToUpdate) {
            return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        }

        if (itemToUpdate.createdById && itemToUpdate.createdById !== user.id) {
            return NextResponse.json({ success: false, error: 'You do not have permission to edit this item.' }, { status: 403 });
        }

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                title,
                linkUrl,
                category,
            },
        });

        return NextResponse.json({ success: true, item: updatedItem });

    } catch (error) {
        console.error("Error updating item:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}