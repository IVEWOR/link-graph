// app/api/stack/reorder/route.js

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
        const { userId, orderedIds } = await request.json();
        if (userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const updatePromises = orderedIds.map((itemId, index) =>
            prisma.userStack.update({
                where: {
                    userId_itemId: { userId, itemId },
                },
                data: { position: index },
            })
        );
        await prisma.$transaction(updatePromises);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error reordering stack:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}