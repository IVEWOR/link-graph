// app/api/items/search/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term) {
        return NextResponse.json({ success: false, error: 'Search term is required' }, { status: 400 });
    }

    try {
        const items = await prisma.item.findMany({
            where: {
                title: {
                    contains: term,
                    mode: 'insensitive', // Case-insensitive search
                },
            },
            take: 10, // Limit results to 10
        });
        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error("Item search error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
