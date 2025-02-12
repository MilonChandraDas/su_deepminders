import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth.utils';
import { MediaType } from '@prisma/client';  // Add this import

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, districtId, fileId } = await req.json();

    const crimeTime = new Date();


    const crimeReport = await prisma.crimeReport.create({
      data: {
        title,
        description,
        districtId,
        crimeTime: new Date(crimeTime),
        postedById: user.id,
        media: {
          create: {
            url: `/api/uploads/${fileId}`,
            type: MediaType.IMAGE
          }
        }
      },
    });

    return NextResponse.json(crimeReport);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const districtId = searchParams.get('districtId');

    const where = districtId ? { districtId: parseInt(districtId) } : {};

    const crimeReports = await prisma.crimeReport.findMany({
      where,
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
        _count: {
          select: {
            comments: true,
            votes: true,
          }
        }
      },
      orderBy: { postTime: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.crimeReport.count({ where });

    return NextResponse.json({
      data: crimeReports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
