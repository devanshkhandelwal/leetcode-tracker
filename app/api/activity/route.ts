import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all problems with review data
    const problems = await prisma.problem.findMany({
      where: {
        lastReviewed: {
          not: null
        }
      },
      select: {
        lastReviewed: true,
        reviewCount: true
      }
    });

    // Group reviews by date
    const activityMap = new Map<string, number>();
    problems.forEach(problem => {
      if (problem.lastReviewed) {
        const dateStr = problem.lastReviewed.toISOString().split('T')[0];
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
      }
    });

    // Transform the data into the format needed by ActivityCalendar
    const activityData = Array.from(activityMap.entries()).map(([dateStr, count]) => ({
      date: new Date(dateStr),
      count
    }));

    return NextResponse.json(activityData);
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return NextResponse.json({ error: 'Failed to fetch activity data' }, { status: 500 });
  }
} 