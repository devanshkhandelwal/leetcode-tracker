import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build the where clause using Prisma's query builder
    const where = {
      ...(difficulty && { difficulty }),
      ...(category && { categoryName: category }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { categoryName: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const problems = await prisma.problem.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, difficulty, categoryName, leetcodeUrl, neetcodeUrl } = body;

    // Validate required fields
    if (!title || !difficulty || !categoryName || !leetcodeUrl || !neetcodeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Create the problem
    const problem = await prisma.problem.create({
      data: {
        title,
        difficulty,
        categoryName,
        leetcodeUrl,
        neetcodeUrl,
        status: 'Not Started',
        reviewCount: 0,
        notes: null,
        lastReviewed: null
      }
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
} 