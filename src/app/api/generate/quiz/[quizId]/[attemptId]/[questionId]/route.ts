import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST route to create or update a quiz response
export async function POST(
    req: Request,
    { params }: { params: { quizId: string, attemptId: string, questionId: string } }
) {
    try {
        const { userId } = await auth();
        const { quizId, attemptId, questionId } = params;
        const { answer } = await req.json();
 
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Verify the quiz exists
        const quiz = await db.quiz.findUnique({
            where: { id: quizId },
        });

        if (!quiz) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            );
        }
        
        // Verify the question exists
        const question = await db.quizQuestion.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Check if a response already exists
        const existingResponse = await db.quizResponse.findFirst({
            where: {
                attemptId: attemptId,
                questionId: questionId
            }
        });

        // Determine if the answer is correct and calculate points
        const isCorrect = answer === question.correctAnswer;
        const pointsEarned = isCorrect ? question.points : 0;

        let quizResponse;
        
        if (!existingResponse) {
            // Create a new response if one doesn't exist
            quizResponse = await db.quizResponse.create({
                data: {
                    attemptId: attemptId,
                    questionId: questionId,
                    userAnswer: answer,
                    isCorrect: isCorrect,
                    pointsEarned: pointsEarned
                }
            });
        } else {
            // Update the existing response
            quizResponse = await db.quizResponse.update({
                where: {
                    id: existingResponse.id
                },
                data: {
                    userAnswer: answer,
                    isCorrect: isCorrect,
                    pointsEarned: pointsEarned
                }
            });
        }

        return NextResponse.json(quizResponse, { status: 200 });
    } catch (error) {
        console.error("[QUIZ_RESPONSE_POST_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}