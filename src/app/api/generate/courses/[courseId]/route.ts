import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Fix: Correctly typing the function parameters
export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !user.id) {
            return NextResponse.json({message:"Unauthorized"}, { status: 401 });
        }

        const currentuser = await db.user.findUnique({
            where: { id: user.id },
        });

        if (!currentuser) {
            return NextResponse.json({message:"Unauthorized"}, { status: 401 });
        }

        // 🔹 Extract required data from the request body
        const body = await request.json();
        const { courseId } = params;
        const { orderIndex } = body; // Fix: Changed chapterIndex to orderIndex to match your component

        if (!courseId) {
            return NextResponse.json({message:"Missing course ID"}, { status: 400 });
        }

        if (orderIndex === undefined || orderIndex === null) {
            return NextResponse.json({message:"Missing chapter index"}, { status: 400 });
        }

        // 🔹 Fetch the study material (course)
        const studyMaterial = await db.studyMaterial.findUnique({
            where: { id: courseId },
        });

        if (!studyMaterial) {
            return NextResponse.json({message:"Study material not found"}, { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const materialLayout = studyMaterial?.materialLayout as any;

        if (!materialLayout.chapters || !Array.isArray(materialLayout.chapters)) {
            return NextResponse.json({ message: "No chapters found in study material" }, { status: 400 });
        }

        // Check if the requested chapter index is valid
        if (orderIndex < 0 || orderIndex >= materialLayout.chapters.length) {
            return NextResponse.json({ message: "Invalid chapter index" }, { status: 400 });
        }

        // Check if the chapter has already been generated
        const existingChapter = await db.studyChapter.findFirst({
            where: {
                CourseId: courseId,
                orderIndex: orderIndex
            }
        });

        if (existingChapter) {
            return NextResponse.json({ message: "Chapter has already been generated" }, { status: 400 });
        }

        // Get the chapter to generate
        const chapter = materialLayout.chapters[orderIndex];

        const prompt = `
        Generate comprehensive study notes for chapter: "${chapter.chapter_name}"
        
        Summary: ${chapter.chapter_summary}
        Topics: ${chapter.topics.join(", ")}
        
        FORMAT INSTRUCTIONS:
        Use semantic HTML with Tailwind CSS classes. No HTML/head/body tags.
        
        REQUIRED ELEMENTS:
        - Chapter title: <h1 class="text-3xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-gray-200">Title</h1>
        - Section headings: <h2 class="text-2xl font-semibold text-blue-700 mt-8 mb-4 pb-1 border-b border-gray-200">Section</h2>
        - Subsections: <h3 class="text-xl font-medium text-blue-600 mt-6 mb-3">Subsection</h3>
        - Paragraphs: <p class="my-3 text-gray-800 leading-relaxed">Content</p>
        - Lists:
          <ul class="my-4 ml-6 space-y-2">
            <li class="flex items-start"><span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span><span>Item</span></li>
          </ul>
          <ol class="my-4 ml-6 list-decimal space-y-2"><li class="pl-1 ml-4">Item</li></ol>
        
        - Notes/Callouts:
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
            <p class="font-medium text-blue-800">Note:</p>
            <p class="text-blue-700">Content</p>
          </div>
        
        - Code: 
          <pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto border border-gray-300">
            <code class="text-gray-800 text-sm font-mono">code here</code>
          </pre>
          Inline: <code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded font-mono text-sm">snippet</code>
        
        - Example boxes:
          <div class="bg-white border border-gray-200 p-4 my-4 rounded-lg shadow-sm">
            <p class="font-medium text-gray-800 mb-2">Example:</p>
            <div class="text-gray-700">Content</div>
          </div>
        
        - Practice exercises:
          <div class="bg-indigo-50 border border-indigo-200 p-4 my-4 rounded-lg">
            <p class="font-medium text-indigo-800 mb-2">Practice Exercise:</p>
            <div class="text-indigo-700 mb-3">Instructions</div>
            <details class="mt-3">
              <summary class="cursor-pointer font-medium text-indigo-600">View Solution</summary>
              <div class="mt-2 pl-4 border-l-2 border-indigo-300 text-indigo-700">Solution</div>
            </details>
          </div>
        
        CONTENT SHOULD INCLUDE:
        - Clear explanations
        - Examples that illustrate concepts
        - Practice exercises with solutions
        - Key takeaways for each section
        
        Use clean, properly nested HTML with consistent indentation.
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
                orderIndex: orderIndex,
            },
        });

        return NextResponse.json({
            message: `Chapter "${chapter.chapter_name}" generated successfully!`,
        });
    } catch (error) {
        console.error("[Create Single Study Chapter with AI]", error);
        return NextResponse.json({message:"Internal Server Error"}, { status: 500 });
    }
}








export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = params;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        if (!courseId) {
            return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
        }

        const studyMaterial = await db.studyMaterial.findUnique({
            where: { id: courseId },
            select: { id: true, createdby: true }
        });

        if (!studyMaterial) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        if (studyMaterial.createdby !== userId) {
            return NextResponse.json({
                error: 'Forbidden: You do not have permission to access this study material'
            }, { status: 400 });
        }

        const body = await req.json();
        const { orderIndex } = body;

        // Use findFirst instead of findUnique
        const chapter = await db.studyChapter.findFirst({
            where: {
                CourseId: studyMaterial.id,
                orderIndex: orderIndex
            }
        });

        if (!chapter) {
            return NextResponse.json(
                { message: "Chapter is not found", ispresent: false },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Chapter found successfully", id: chapter.id, ispresent: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error finding chapter:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



