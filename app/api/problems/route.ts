import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getSession(request);
    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || undefined;
    const categoryName = searchParams.get("categoryName") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;

    let where: Prisma.ProblemWhereInput = {
      userId: user.id // Filter by user
    };

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive" as Prisma.QueryMode
          }
        },
        {
          categoryName: {
            contains: query,
            mode: "insensitive" as Prisma.QueryMode
          }
        }
      ];
    }

    if (status) where.status = status;
    if (categoryName) where.categoryName = categoryName;
    if (difficulty) where.difficulty = difficulty;

    console.log("Search filter used:", where);

    const problems = await prisma.problem.findMany({
      where,
      include: {
        category: true
      },
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error instanceof Error ? error.message : error);
    console.error("Full error:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // First, get the user from the session
    const session = await getSession(request);
    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find or create the user
    const user = await prisma.user.upsert({
      where: { auth0Id: session.user.sub },
      update: {},
      create: {
        auth0Id: session.user.sub,
        email: session.user.email || "",
        name: session.user.name || "",
      },
    });

    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        difficulty: data.difficulty,
        status: data.status || "Not Started",
        categoryName: data.categoryName,
        leetcodeUrl: data.leetcodeUrl,
        neetcodeUrl: data.neetcodeUrl,
        notes: data.notes,
        user: {
          connect: {
            id: user.id
          }
        },
        category: {
          connectOrCreate: {
            where: {
              name: data.categoryName
            },
            create: {
              name: data.categoryName
            }
          }
        }
      },
      include: {
        category: true,
        user: true
      },
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
} 