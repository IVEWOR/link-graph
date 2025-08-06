// app/api/items/create/route.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

const categorizeItem = (itemName) => {
    const lowerItem = itemName.toLowerCase();
    if (['vscode', 'vim', 'neovim', 'sublime', 'atom'].some(k => lowerItem.includes(k))) return 'Editor';
    if (['react', 'vue', 'angular', 'svelte', 'next.js'].some(k => lowerItem.includes(k))) return 'Framework';
    if (['javascript', 'python', 'go', 'rust', 'typescript'].some(k => lowerItem.includes(k))) return 'Language';
    if (['postgres', 'mongo', 'mysql', 'redis'].some(k => lowerItem.includes(k))) return 'Database';
    if (['aws', 'gcp', 'azure', 'vercel', 'netlify'].some(k => lowerItem.includes(k))) return 'Hosting';
    return 'Tool';
};

export async function POST(request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 401 });

    try {
        const { title, linkUrl, category, imageUrl } = await request.json();

        if (!title) {
            return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
        }

        const existingItem = await prisma.item.findFirst({
            where: { title: { equals: title, mode: 'insensitive' } },
        });

        if (existingItem) {
            return NextResponse.json({ success: false, error: 'Item with this title already exists' }, { status: 409 });
        }

        const newItem = await prisma.item.create({
            data: {
                title,
                linkUrl: linkUrl || '#',
                category: category || 'Tool',
                imageUrl: imageUrl || `https://logo.clearbit.com/${title.toLowerCase().replace(/\s/g, '')}.com`,
                createdById: user.id,
            }
        });
        return NextResponse.json({ success: true, item: newItem });
    } catch (error) {
        console.error("Error creating item:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}