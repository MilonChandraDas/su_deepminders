import { cookies } from 'next/headers';
import { verifyAccessToken } from './auth';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);
  if (!payload?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.userId) },
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
      profilePicture: true,
      bio: true,
    }
  });

  return user;
}
