import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth.utils';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                isVerified: true,
                role: true,
                profilePicture: true,
                bio: true,
                createdAt: true,
                _count: {
                    select: {
                        crimeReports: true,
                        comments: true,
                    }
                }
            }
        });
        console.log("userData", userData);

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(userData);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
