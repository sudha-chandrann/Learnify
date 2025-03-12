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
    Generate comprehensive, well-structured study notes for the chapter: "${chapter.chapter_name}".
    
    Chapter Summary: ${chapter.chapter_summary}
    
    Topics Covered:
    - ${chapter.topics.join("\n- ")}
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    1. Create beautiful, student-friendly content with clear structure and visual hierarchy
    2. Format your response using semantic HTML with proper indentation (no HTML, head, body, or title tags)
    3. Use Tailwind CSS classes for styling directly in your HTML elements
    
    Use the following HTML elements with appropriate Tailwind classes:
    
    - Chapter title: <h1 class="text-3xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-gray-200">Chapter Title</h1>
    
    - Main section headings: <h2 class="text-2xl font-semibold text-blue-700 mt-8 mb-4 pb-1 border-b border-gray-200">Section Heading</h2>
    
    - Subsection headings: <h3 class="text-xl font-medium text-blue-600 mt-6 mb-3">Subsection Heading</h3>
    
    - Paragraphs: <p class="my-3 text-gray-800 leading-relaxed">Your content here...</p>
    
    - Unordered lists: 
      <ul class="my-4 ml-6 space-y-2">
        <li class="flex items-start">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
          <span>List item text</span>
        </li>
      </ul>
    
    - Ordered lists: 
      <ol class="my-4 ml-6 list-decimal space-y-2">
        <li class="pl-1 ml-4">Ordered list item</li>
      </ol>
    
    - Important notes: 
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
        <p class="font-medium text-blue-800">Note:</p>
        <p class="text-blue-700">Important information here...</p>
      </div>
    
    - Warnings: 
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded-r">
        <p class="font-medium text-yellow-800">Warning:</p>
        <p class="text-yellow-700">Warning information here...</p>
      </div>
    
    - Tips: 
      <div class="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r">
        <p class="font-medium text-green-800">Tip:</p>
        <p class="text-green-700">Helpful tip here...</p>
      </div>
    
    - Code blocks: 
      <pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto border border-gray-300">
        <code class="text-gray-800 text-sm font-mono">
          // Your code here with proper indentation
          function example() {
            return "Hello World";
          }
        </code>
      </pre>
    
    - Inline code: <code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded font-mono text-sm">code snippet</code>
    
    - Examples: 
      <div class="bg-white border border-gray-200 p-4 my-4 rounded-lg shadow-sm">
        <p class="font-medium text-gray-800 mb-2">Example:</p>
        <div class="text-gray-700">Example content here...</div>
      </div>
    
    - Practice exercises: 
      <div class="bg-indigo-50 border border-indigo-200 p-4 my-4 rounded-lg">
        <p class="font-medium text-indigo-800 mb-2">Practice Exercise:</p>
        <div class="text-indigo-700 mb-3">Exercise instructions here...</div>
        <details class="mt-3">
          <summary class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-800">View Solution</summary>
          <div class="mt-2 pl-4 border-l-2 border-indigo-300 text-indigo-700">
            Solution details here...
          </div>
        </details>
      </div>
    
    - Definition boxes: 
      <div class="bg-green-50 border border-green-200 p-4 my-4 rounded-lg">
        <p class="font-medium text-green-800 mb-1">Definition:</p>
        <p class="text-green-700">Term definition here...</p>
      </div>
    
    - Tables: 
      <div class="my-4 overflow-x-auto">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left text-gray-700">Column 1</th>
              <th class="border border-gray-300 px-4 py-2 text-left text-gray-700">Column 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2 text-gray-700">Data 1</td>
              <td class="border border-gray-300 px-4 py-2 text-gray-700">Data 2</td>
            </tr>
          </tbody>
        </table>
      </div>
    
    - Emphasis: <strong class="font-semibold text-gray-900">emphasized text</strong> or <em class="italic">italicized text</em>
    
    - Links: <a href="#" class="text-blue-600 hover:underline">link text</a>
    
    - Formula/equation display: 
      <div class="bg-gray-50 px-4 py-2 my-4 text-center border border-gray-200 rounded font-mono text-gray-800">
        E = mc<sup>2</sup>
      </div>
    
    Create content that includes:
    - Clear explanations of each topic
    - Real-world examples that illustrate concepts
    - Visual descriptions (where diagrams would be helpful)
    - Practice exercises with solutions
    - Key points and takeaways for each section
    
    Your HTML should be clean, properly nested, and maintain consistent indentation for readability.
    generate all the topics completely
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



