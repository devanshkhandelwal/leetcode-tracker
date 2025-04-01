import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to convert difficulty to numeric value
function difficultyToNumber(difficulty: string): number {
  switch (difficulty) {
    case 'Easy':
      return 1;
    case 'Medium':
      return 2;
    case 'Hard':
      return 3;
    default:
      return 0;
  }
}

interface Problem {
  difficulty: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    // Build the where clause using prepared statements
    const where: any = {};
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = {
        name: category
      };
    }

    // Get total problems count
    const totalProblems = await prisma.problem.count({ where });

    // Get completed problems count
    const completedProblems = await prisma.problem.count({
      where: {
        ...where,
        status: 'Completed'
      }
    });

    // Get in progress problems count
    const inProgressProblems = await prisma.problem.count({
      where: {
        ...where,
        status: 'In Progress'
      }
    });

    // Get not started problems count
    const notStartedProblems = await prisma.problem.count({
      where: {
        ...where,
        status: 'Not Started'
      }
    });

    // Get average review count
    const problemsWithReviews = await prisma.problem.findMany({
      where: {
        ...where,
        reviewCount: {
          gt: 0
        }
      },
      select: {
        reviewCount: true
      }
    });

    const averageReviewCount = problemsWithReviews.length > 0
      ? problemsWithReviews.reduce((acc: number, p: { reviewCount: number }) => acc + p.reviewCount, 0) / problemsWithReviews.length
      : 0;

    // Get problems due for review (reviewed more than 7 days ago)
    const problemsDueForReview = await prisma.problem.count({
      where: {
        ...where,
        lastReviewed: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get all problems for average difficulty calculation
    const allProblems = await prisma.problem.findMany({
      where: {
        ...where,
        status: 'Completed'
      },
      select: {
        difficulty: true
      }
    });

    // Calculate average difficulty
    const averageDifficulty = allProblems.length > 0
      ? allProblems.reduce((acc: number, p: Problem) => acc + difficultyToNumber(p.difficulty), 0) / allProblems.length
      : 0;

    return NextResponse.json({
      totalProblems,
      completedProblems,
      inProgressProblems,
      notStartedProblems,
      averageReviewCount,
      problemsDueForReview,
      averageDifficulty
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
} 