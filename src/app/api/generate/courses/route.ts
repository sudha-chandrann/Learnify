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

    // 🔹 Ensure materialLayout has chapters and parse them
    const materialLayout = studyMaterial.materialLayout as unknown as {
      chapters: { chapter_name: string; chapter_summary: string; topics: string[] }[];
    };

    if (!materialLayout.chapters || !Array.isArray(materialLayout.chapters)) {
      return new NextResponse("No chapters found in study material", { status: 400 });
    }

    for (let i = 0; i < materialLayout.chapters.length; i++) {
          const chapter = materialLayout.chapters[i];
          
          const prompt = `
            Generate detailed study notes for the chapter: "${chapter.chapter_name}".
            Chapter Summary: ${chapter.chapter_summary}.
            Topics Covered:
            - ${chapter.topics.join("\n- ")}
            
            Provide structured and well-formatted content in a student-friendly way.
            Include examples, diagrams descriptions, and practice exercises where appropriate.
          `;
          
          const chatSession = model.startChat({ history: [] });
          const result = await chatSession.sendMessage(prompt);
          let responseText = result.response.text();
          responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
          
          // Store the generated chapter notes in the database
          await db.studyChapter.create({
            data: {
              CourseId: courseId,
              notes: responseText,
              orderIndex: i,
            },
          });

        }

    // 🔹 Update the study material status to "created" after all chapters are generated
    await db.studyMaterial.update({
      where: { id: courseId },
      data: { status: "created" }
    });

    return NextResponse.json({
      message: "Chapters with AI-generated notes created successfully!",
    });
  } catch (error) {
    console.error("[Create Study Chapters with AI]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
