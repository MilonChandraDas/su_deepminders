import { NextResponse } from 'next/server';
import { hashPassword, createAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
    try {
        const { email, password, phoneNumber } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                phoneNumber,
            },
        });

        const token = await createAccessToken({ userId: user.id });

        return NextResponse.json({ token });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
