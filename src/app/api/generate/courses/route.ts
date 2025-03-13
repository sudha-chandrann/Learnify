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
      return NextResponse.json({ message: "Missing course ID" }, { status: 400 });
    }

    // 🔹 Fetch the study material (course)
    const studyMaterial = await db.studyMaterial.findUnique({
      where: { id: courseId },
    });

    if (!studyMaterial) {
      return NextResponse.json({ message: "Study material not found" }, { status: 404 });
    }

    // 🔹 Ensure materialLayout has chapters and parse them
    const materialLayout = studyMaterial.materialLayout as unknown as {
      chapters: { chapter_name: string; chapter_summary: string; topics: string[] }[];
    };

    if (!materialLayout.chapters || !Array.isArray(materialLayout.chapters)) {
      return NextResponse.json({ message: "No chapters found in study material" }, { status: 400 });
    }

    // Determine how many chapters to process (first two or all chapters if less than two)
    const chaptersToProcess = Math.min(1, materialLayout.chapters.length);

    for (let i = 0; i < chaptersToProcess; i++) {
      const chapter = materialLayout.chapters[i];

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
          orderIndex: i,
        },
      });
    }

    // Update the study material status to "in_progress" as only initial chapters are created
    await db.studyMaterial.update({
      where: { id: courseId },
      data: { status: "created" }
    });



    return NextResponse.json({
      message: "Initial chapters with AI-generated notes created successfully!",
    });
  } catch (error) {
    console.error("[Create Initial Study Chapters with AI]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}