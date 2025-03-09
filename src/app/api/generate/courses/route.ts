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
