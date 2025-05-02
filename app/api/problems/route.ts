import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || undefined;
    const categoryName = searchParams.get("categoryName") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;

    let where: Prisma.ProblemWhereInput = {};

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

    // Validate required fields
    if (!data.title || !data.difficulty || !data.categoryName || !data.leetcodeUrl || !data.neetcodeUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First ensure the category exists
    const category = await prisma.category.upsert({
      where: { name: data.categoryName },
      update: {},
      create: { name: data.categoryName }
    });

    // Then create the problem
    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        difficulty: data.difficulty,
        status: data.status || "Not Started",
        categoryName: category.name,
        leetcodeUrl: data.leetcodeUrl,
        neetcodeUrl: data.neetcodeUrl,
        notes: data.notes || null
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error("Error creating problem:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create problem";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 