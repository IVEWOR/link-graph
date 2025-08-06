// app/api/stack/add/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { userId, itemId } = await request.json();

        if (!userId || !itemId) {
            return NextResponse.json({ success: false, error: 'User ID and Item ID are required' }, { status: 400 });
        }

        // Check if the item already exists in the user's stack
        const existingStackItem = await prisma.userStack.findUnique({
            where: {
                userId_itemId: {
                    userId,
                    itemId,
                },
            },
        });

        if (existingStackItem) {
            return NextResponse.json({ success: false, error: 'Item already in stack' }, { status: 409 });
        }

        // Get the highest position for the user's current stack
        const maxPosition = await prisma.userStack.aggregate({
            _max: {
                position: true,
            },
            where: {
                userId,
            },
        });

        const newPosition = (maxPosition._max.position ?? -1) + 1;

        const newStackItem = await prisma.userStack.create({
            data: {
                userId,
                itemId,
                position: newPosition,
            },
        });

        return NextResponse.json({ success: true, stackItem: newStackItem });
    } catch (error) {
        console.error("Error adding item to stack:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
