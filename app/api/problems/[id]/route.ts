import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid problem ID' },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid problem ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { notes, status, reviewCount, lastReviewed } = body;

    const problem = await prisma.problem.update({
      where: { id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
        ...(reviewCount !== undefined && { reviewCount }),
        ...(lastReviewed && { lastReviewed: new Date(lastReviewed) })
      }
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid problem ID' },
        { status: 400 }
      );
    }

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id }
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Delete the problem
    await prisma.problem.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
} 