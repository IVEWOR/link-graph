// app/[username]/page.js
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import ProfileClient from '../../components/ProfileClient';

const prisma = new PrismaClient();

async function getUserData(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      stacks: {
        include: {
          item: true, // Include the actual Item details
        },
        orderBy: {
          position: 'asc', // Order the stack by position
        },
      },
    },
  });
  return user;
}

// FIX: This structure correctly handles the dynamic params and resolves the Next.js warning.
export default async function UserProfilePage({ params }) {
  const { username } = params;
  const user = await getUserData(username);

  if (!user) {
    notFound();
  }

  return <ProfileClient user={user} />;
}
