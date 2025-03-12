// File: app/api/quiz-stats/[attemptId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
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





// GET route to retrieve statistics for a quiz attempt
export async function PATCH(
    req: Request,
    { params }: { params: { attemptId: string } }
) {
    try {
        const { userId } = await auth();
        const { attemptId } = params;

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Fetch the attempt details
        const attempt = await db.quizAttempt.findUnique({
            where: { id: attemptId },
            include: {
                quiz: {
                    include: {
                        questions: true
                    }
                },
                responses: true
            }
        });

        if (!attempt) {
            return NextResponse.json(
                { error: "Quiz attempt not found" },
                { status: 404 }
            );
        }

        // Verify the user owns this attempt
        if (attempt.userId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized access to this attempt" },
                { status: 403 }
            );
        }

        // Calculate statistics
        const totalQuestions = attempt.quiz.questions.length;
        const answeredQuestions = attempt.responses.length;
        const unansweredQuestions = totalQuestions - answeredQuestions;
        
        const correctAnswers = attempt.responses.filter(response => response.isCorrect).length;
        const wrongAnswers = answeredQuestions - correctAnswers;
        
        const pointsEarned = attempt.responses.reduce((total, response) => total + response.pointsEarned, 0);
        const maxPossiblePoints = attempt.maxScore;
        
        // Get percentage score
        const percentageScore = (pointsEarned / maxPossiblePoints) * 100;
        
        // Determine if user passed the quiz
        const passed = percentageScore >= attempt.quiz.passingScore;

        return NextResponse.json({
            statistics: {
                totalQuestions,
                answeredQuestions,
                unansweredQuestions,
                correctAnswers,
                wrongAnswers,
                pointsEarned,
                maxPossiblePoints,
                percentageScore: parseFloat(percentageScore.toFixed(2)),
                passed,
                completed: attempt.completed
            }
        }, { status: 200 });
    } catch (error) {
        console.error("[QUIZ_ATTEMPT_STATS_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}