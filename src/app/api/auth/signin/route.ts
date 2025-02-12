import { NextResponse } from 'next/server';
import { hashPassword, createAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.findFirst({
      where: {
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createAccessToken({ userId: user.id });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
