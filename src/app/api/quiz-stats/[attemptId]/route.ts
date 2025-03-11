// File: app/api/quiz-stats/[attemptId]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;

    if (!attemptId) {
      return NextResponse.json(
        { error: "Missing attempt ID" },
        { status: 400 }
      );
    }

    // Count all quiz responses that have a non-empty userAnswer
    const responses = await db.quizResponse.findMany({
      where: {
        attemptId: attemptId,
        userAnswer: {
          not: "",
        },
      },
    });

    const answeredCount = responses.length;

    return NextResponse.json({ answeredCount });
  } catch (error) {
    console.error("Error fetching quiz statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz statistics" },
      { status: 500 }
    );
  }
}