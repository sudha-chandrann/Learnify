import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST route to submit a completed quiz attempt
export async function POST(
    req: Request,
    { params }: { params: { quizId: string, attemptId: string } }
) {
    try {
        const { userId } = await auth();
        const { quizId, attemptId } = params;
     
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Verify the quiz exists
        const quiz = await db.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });

        if (!quiz) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            );
        }

        // Verify the attempt exists and belongs to the user
        const attempt = await db.quizAttempt.findUnique({
            where: { id: attemptId },
            include: { responses: true }
        });

        if (!attempt) {
            return NextResponse.json(
                { error: "Quiz attempt not found" },
                { status: 404 }
            );
        }

        if (attempt.userId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized access to this attempt" },
                { status: 403 }
            );
        }

        if (attempt.completed) {
            return NextResponse.json(
                { error: "This quiz attempt has already been submitted" },
                { status: 400 }
            );
        }

        // Calculate the final score
        const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);
        const earnedPoints = attempt.responses.reduce((sum, response) => sum + response.pointsEarned, 0);
        const finalScore = earnedPoints;

        // Update the attempt as completed
        await db.quizAttempt.update({
            where: { id: attemptId },
            data: {        
                completed: true,
                completedAt: new Date(),
                score: finalScore,
                maxScore: totalPoints
            }
        });

        return NextResponse.json({ 
            success: true,
        }, { status: 200 });
    } catch (error) {
        console.error("[QUIZ_SUBMIT_ATTEMPT_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}