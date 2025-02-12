import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth.utils';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { value } = await req.json();
    
    // Validate vote value
    if (value !== 1 && value !== -1) {
      return NextResponse.json({ error: 'Invalid vote value' }, { status: 400 });
    }

    // Check if report exists
    const report = await prisma.crimeReport.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Upsert the vote (create or update)
    const vote = await prisma.vote.upsert({
      where: {
        userId_crimeReportId: {
          userId: user.id,
          crimeReportId: report.id
        }
      },
      update: { value },
      create: {
        value,
        userId: user.id,
        crimeReportId: report.id
      }
    });

    return NextResponse.json({ success: true });
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

    await prisma.vote.delete({
      where: {
        userId_crimeReportId: {
          userId: user.id,
          crimeReportId: parseInt(params.id)
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
