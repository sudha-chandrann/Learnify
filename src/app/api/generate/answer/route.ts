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
            return  NextResponse.json({message:"Unauthorized"}, { status: 401 });
        }

        const currentuser = await db.user.findUnique({
            where: { id: user.id },
        });

        if (!currentuser) {
            return  NextResponse.json({message:"Unauthorized"}, { status: 401 });
        }

        // 🔹 Extract required data from the request body
        const body = await req.json();
        const { courseId } = body;

        if (!courseId) {
            return  NextResponse.json({message:"Missing course ID"}, { status: 400 });
        }

        // 🔹 Fetch the study material (course)
        const studyMaterial = await db.studyMaterial.findUnique({
            where: { id: courseId },
        });

        if (!studyMaterial) {
            return  NextResponse.json({message:"Study material not found"}, { status: 404 });
        }

        // Check if the course already has a QA collection
        const existingQAcollection = await db.qACollection.findUnique({
            where: { studyMaterialId: courseId },
        });

        if (existingQAcollection) {
            return  NextResponse.json({message:"QA collection already exists for this course"}, { status: 409 });
        }

        const materialLayout = studyMaterial?.materialLayout as Record<string, unknown> | null;
        const courseName = materialLayout?.course_name as string || studyMaterial?.topic || 'Untitled Course';
        
        // First create the QA collection
        const qaCollection = await db.qACollection.create({
            data: {
                studyMaterialId: studyMaterial.id,
                createdby: studyMaterial.createdby,
                title: `QA Collection: ${courseName}`,
                description: `Question and Answer pairs for ${courseName}`,
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

        let pairIndex = 0;

        // Generate 3-5 QA pairs per chapter
        for (let i = 0; i < chapters.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const materialLayout = studyMaterial?.materialLayout as any;
            const chapterData = materialLayout?.chapters[i] || {};
            const chapterName = chapterData.chapter_name || `Chapter ${i + 1}`;
            const topics = chapterData.topics || [];

            const prompt = `
                Create 3-5 question-answer pairs for "${chapterName}".
                Topics include: ${topics.join(", ")}.
  
                The questions should test understanding of key concepts.
  
                Format the response as a JSON array:
                [
                  {
                    "question": "The question text here",
                    "answer": "The comprehensive answer here",
                    "category": "${chapterName}",
                    "difficulty": 2 // on a scale of 1-5
                  },
                  // more question-answer pairs...
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
                    const qaPairsData = JSON.parse(jsonMatch[0]);

                    // Create each QA pair in the database
                    for (const qaPair of qaPairsData) {
                        await db.qAPair.create({
                            data: {
                                collectionId: qaCollection.id,
                                question: qaPair.question,
                                answer: qaPair.answer,
                                category: qaPair.category || chapterName,
                                difficulty: qaPair.difficulty || 2,
                                orderIndex: pairIndex++,
                            },
                        });
                    }
                } catch (parseError) {
                    console.error(`Error parsing JSON from chapter ${i + 1}:`, parseError);
                }
            }
        }

        return NextResponse.json({
            message: "QA collection generated successfully!",
            collectionId: qaCollection.id
        });
    } catch (error) {
        console.error("[Generate QA Collection with AI]", error);
        return  NextResponse.json({message:"Internal Server Error"}, { status: 500 });
    }
}