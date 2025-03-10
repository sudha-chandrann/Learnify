import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentuser = await db.user.findUnique({
            where: { id: user.id },
        });

        if (!currentuser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 🔹 Extract required data from the request body
        const body = await req.json();
        const { courseId } = body;

        if (!courseId) {
            return new NextResponse("Missing course ID", { status: 400 });
        }

        // 🔹 Fetch the study material (course)
        const studyMaterial = await db.studyMaterial.findUnique({
            where: { id: courseId },
        });

        if (!studyMaterial) {
            return new NextResponse("Study material not found", { status: 404 });
        }

        // Check if the course already has a flashcard set
        const existingquiz = await db.quiz.findUnique({
            where: { studyMaterialId: courseId },
        });

        if (existingquiz) {
            return new NextResponse("quiz set already exists for this course", { status: 409 });
        }

        const materialLayout = studyMaterial?.materialLayout as Record<string, unknown> | null;
        const courseName = materialLayout?.course_name as string || studyMaterial?.topic || 'Untitled Course';
        //   // First create the quiz
        const quiz = await db.quiz.create({
            data: {
                studyMaterialId: studyMaterial.id,
                createdby: studyMaterial.createdby,
                title: `Quiz: ${courseName}`,
                description: `Quiz for ${courseName}`,
                timeLimit: 30, // 30 minutes default
                passingScore: 70, // 70% passing score
            },
        });

        // Fetch chapters
        const chapters = await db.studyChapter.findMany({
            where: {
                CourseId: courseId,
            },
            orderBy: {
                orderIndex: "asc",
            },
        });

        let questionIndex = 0;

        // Generate 5-10 flashcards per chapter
        for (let i = 0; i < chapters.length; i++) {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const materialLayout = studyMaterial?.materialLayout as any;
            const chapterData = materialLayout?.chapters[i] || {};
            const chapterName = chapterData.chapter_name || `Chapter ${i + 1}`;
            const topics = chapterData.topics || [];

            const prompt = `
                    Create 3-5 quiz questions for "${chapterName}".
                    Topics include: ${topics.join(", ")}.
      
                    Include a mix of multiple choice and true/false questions.
      
                    Format the response as a JSON array:
                    [
                      {
                        "questionText": "The question text here",
                        "questionType": "MultipleChoice", // or "TrueFalse, // fillin the blanks"
                        "options": ["Option A", "Option B", "Option C", "Option D"], // for multiple choice
                        "correctAnswer": "The correct answer exactly as it appears in options",
                        "explanation": "Explanation of why this is the correct answer",
                        "points": 2 // point value
                      },
                      // more questions...
                    ]
            `;

            const chatSession = model.startChat({ history: [] });
            const result = await chatSession.sendMessage(prompt);
            let responseText = result.response.text();

            // Clean the response and extract JSON
            responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);

            if (jsonMatch) {
                try {
                    const questionsData = JSON.parse(jsonMatch[0]);

                    // Create each question in the database
                    for (const question of questionsData) {
                        await db.quizQuestion.create({
                            data: {
                                quizId: quiz.id,
                                questionText: question.questionText,
                                questionType: question.questionType,
                                options: question.options || null,
                                correctAnswer: question.correctAnswer,
                                explanation: question.explanation || null,
                                points: question.points || 1,
                                orderIndex: questionIndex++,
                            },
                        });
                    }

                } catch (parseError) {
                    console.error(`Error parsing JSON from chapter ${i + 1}:`, parseError);
                }
            }




        }


        return NextResponse.json({
            message: "Flashcards generated successfully!",
        });
    } catch (error) {
        console.error("[Generate Flashcards with AI]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}