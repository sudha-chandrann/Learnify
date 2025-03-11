// File: app/api/quiz-response/[attemptId]/[questionId]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string; questionId: string } }
) {
  try {
    const { attemptId, questionId } = params;

    if (!attemptId || !questionId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await db.quizResponse.findUnique({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
    });

    return NextResponse.json(response || {});
  } catch (error) {
    console.error("Error fetching quiz response:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz response" },
      { status: 500 }
    );
  }
}