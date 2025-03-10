import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = await auth();
    const { quizId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    const maxScore = quiz.questions.reduce((total, question) => total + question.points, 0);

    const quizAttempt = await db.quizAttempt.create({
      data: {
        quizId: quizId,
        userId: userId,
        score: 0,
        maxScore: maxScore,
        startedAt: new Date(),
        completed: false,
      },
    });

    return NextResponse.json(quizAttempt, { status: 200 });
  } catch (error) {
    console.error("[QUIZ_ATTEMPT_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
