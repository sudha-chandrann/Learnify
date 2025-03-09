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
    const existingFlashcardSet = await db.flashcardSet.findUnique({
      where: { studyMaterialId: courseId },
    });

    if (existingFlashcardSet) {
      return new NextResponse("Flashcard set already exists for this course", { status: 409 });
    }

    const materialLayout = studyMaterial?.materialLayout as Record<string, unknown> | null;
    const courseName = materialLayout?.course_name as string || studyMaterial?.topic || 'Untitled Course';
    
    // Create flashcard set
    const flashcardSet = await db.flashcardSet.create({
      data: {
        studyMaterialId: studyMaterial.id,
        createdby: studyMaterial.createdby,
        title: `Flashcards: ${courseName}`,
        description: `Flashcards for ${courseName}`,
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

    // Track statistics for response
    const stats = {
      totalChapters: chapters.length,
      totalFlashcards: 0,
      chaptersProcessed: 0,
    };
    
    // Generate 5-10 flashcards per chapter
    for (let i = 0; i < chapters.length; i++) {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const materialLayout = studyMaterial?.materialLayout as any;
      const chapterData = materialLayout?.chapters[i] || {};
      const chapterName =chapterData.chapter_name || `Chapter ${i +1}`;
      const topics = chapterData.topics || [];

      
      // Extract chapter content from notes
      const chapterContent = chapters[i].notes;
      
      const prompt = `
        Create 5 to 7 flashcards for studying "${chapterName}".
        Chapter content: ${chapterContent.substring(0, 2000)}...
        ${topics.length > 0 ? `Topics include: ${topics.join(", ")}.` : ''}

        For each flashcard, provide:
        1. A front side with a question, term, or concept
        2. A back side with the answer, definition, or explanation
        3. A difficulty rating from 1-5 (1 being easiest, 5 being hardest)
        4. Up to 3 tags relating to the content

        Format the response as a JSON array:
        [
          {
            "front": "Question or term here",
            "back": "Answer or definition here",
            "difficulty": 2,
          },
          // more flashcards...
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
          const flashcardsData = JSON.parse(jsonMatch[0]);
  
          // Create each flashcard in the database
          for (const card of flashcardsData) {
            await db.flashcard.create({
              data: {
                flashcardSetId: flashcardSet.id,
                front: card.front,
                back: card.back,
                difficulty: card.difficulty || 1,
              },
            });
            stats.totalFlashcards++;
          }
          
          stats.chaptersProcessed++;
        } catch (parseError) {
          console.error(`Error parsing JSON from chapter ${i+1}:`, parseError);
        }
      }
    }

    return NextResponse.json({
      message: "Flashcards generated successfully!",
      flashcardSetId: flashcardSet,
      stats: stats
    });
  } catch (error) {
    console.error("[Generate Flashcards with AI]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}