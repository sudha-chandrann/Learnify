/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/study-materials/route.ts

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
    
    // Extract data from the request body
    const body = await req.json();
    const { topic, difficultyLevel, materialType} = body;
    if (!topic || !difficultyLevel || !materialType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Generate course structure with AI
    const structurePrompt = `
      Create a comprehensive learning structure for a ${difficultyLevel} level ${materialType} on "${topic}".
      
      Return a JSON object with the following structure:
      {
        "course_name": "Descriptive title for the course",
        "course_summary": "Comprehensive summary of the course content and learning objectives",
        "level": "${difficultyLevel}",
        "chapters": [
          {
            "chapter_name": "Chapter title",
            "chapter_summary": "Brief summary of this chapter",
            "topics": ["Topic 1", "Topic 2", "Topic 3"]
          }
          // 4-6 chapters recommended
        ]
      }
    `;

    const chatSession = model.startChat({ history: [] });
    const structureResult = await chatSession.sendMessage(structurePrompt);
    let responseText = structureResult.response.text();
    
    // Clean the response for proper JSON parsing
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
    
    // Extract the JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new NextResponse("Failed to generate valid course structure", { status: 500 });
    }
    
    const materialLayout = JSON.parse(jsonMatch[0]);
    
    // Create the study material entry
    const studyMaterial = await db.studyMaterial.create({
      data: {
        topic,
        difficultyLevel,
        materialType,
        createdby: user.id,
        materialLayout,
        status: "generating",
      },
    });
    
    return NextResponse.json({
      message: "Study material creation initiated",
      studyMaterial,
    });
    
  } catch (error) {
    console.error("[Create Study Material]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



