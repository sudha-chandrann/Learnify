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
    const currentuser= await db.user.findUnique({
      where:{
        id:user.id
      }
    })
    if (!currentuser ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // 🔹 Extract required data from the request body
    const body = await req.json();
    
    const { topic, difficultyLevel, studyType } = body;

    if (!topic || !difficultyLevel || !studyType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 🔹 Generate Study Material using Gemini AI
    const prompt = `Generate a study material for ${topic} for a ${studyType}, and the level of difficulty will be ${difficultyLevel}. The output should be in JSON format with a course summary, a list of chapters (each with a summary), and a list of topics in each chapter.`;

    const chatSession = model.startChat({ history: [] });
    const result = await chatSession.sendMessage(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
    let generatedMaterial;
    try {
        generatedMaterial = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return new NextResponse("Invalid JSON format from Gemini API", { status: 500 });
    }

    // 🔹 Store the generated material in Prisma (Database)
     await db.studyMaterial.create({
      data: {
        topic,
        difficultyLevel:difficultyLevel,
        materialType: studyType,
        createdby: currentuser.id,
        materialLayout: generatedMaterial,
      },
    });
    return NextResponse.json({
      message: "Study material generated and stored successfully!"
    });
  } catch (error) {
    console.error("[Generate Study Material]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
