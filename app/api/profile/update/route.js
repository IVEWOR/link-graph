// app/api/profile/update/route.js

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
        const { name, description, socialLinks, avatarUrl } = await request.json();

        // Build the data object with only the fields that are provided
        const dataToUpdate = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (description !== undefined) dataToUpdate.description = description;
        if (socialLinks !== undefined) dataToUpdate.socialLinks = socialLinks;
        if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: dataToUpdate,
        });
        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}