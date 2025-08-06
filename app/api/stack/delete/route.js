// app/api/stack/delete/route.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

export async function POST(request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 401 });

    try {
        const { userId, itemId } = await request.json();
        if (userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await prisma.userStack.delete({
            where: {
                userId_itemId: { userId, itemId },
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting item from stack:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}