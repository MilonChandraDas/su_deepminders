import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth.utils';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const crimeReport = await prisma.crimeReport.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                district: true,
                postedBy: {
                    select: {
                        id: true,
                        email: true,
                        profilePicture: true,
                    }
                },
                media: true,
                comments: {
                    include: {
                        postedBy: {
                            select: {
                                id: true,
                                email: true,
                                profilePicture: true,
                            }
                        },
                        media: true,
                    }
                },
                votes: true,
            }
        });

        if (!crimeReport) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        return NextResponse.json(crimeReport);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const crimeReport = await prisma.crimeReport.findUnique({
            where: { id: parseInt(params.id) }
        });

        if (!crimeReport) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        if (crimeReport.postedById !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, description, districtId, crimeTime, latitude, longitude } = await req.json();

        const updated = await prisma.crimeReport.update({
            where: { id: parseInt(params.id) },
            data: {
                title,
                description,
                districtName: districtId,
                crimeTime: new Date(crimeTime),
                latitude,
                longitude,
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const crimeReport = await prisma.crimeReport.findUnique({
            where: { id: parseInt(params.id) }
        });

        if (!crimeReport) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        if (crimeReport.postedById !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.crimeReport.delete({
            where: { id: parseInt(params.id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
