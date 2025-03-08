/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/study-materials/route.ts

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Prisma } from "@prisma/client";

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
    console.log("the topic ares",topic,difficultyLevel,materialType)
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

    // Asynchronously generate content (we'll return immediately)
    // generateContent(studyMaterial.id, contentTypes, materialLayout);
    
    return NextResponse.json({
      message: "Study material creation initiated",
      studyMaterial,
    });
    
  } catch (error) {
    console.error("[Create Study Material]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// This function runs asynchronously after the response is sent
// async function generateContent(
//   studyMaterialId: string, 
//   contentTypes: string[], 
//   materialLayout: any
// ) {
//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
//     // Generate chapters if requested
//     if (contentTypes.includes("chapters")) {
//       await generateChapters(studyMaterialId, materialLayout, model);
//     }
    
//     // Generate flashcards if requested
//     if (contentTypes.includes("flashcards")) {
//       await generateFlashcards(studyMaterialId, materialLayout, model);
//     }
    
//     // Generate quiz if requested
//     if (contentTypes.includes("quiz")) {
//       await generateQuiz(studyMaterialId, materialLayout, model);
//     }
    
//     // Generate Q&A if requested
//     if (contentTypes.includes("qa")) {
//       await generateQA(studyMaterialId, materialLayout, model);
//     }
    
//     // Update status to created when all content is generated
//     await db.studyMaterial.update({
//       where: { id: studyMaterialId },
//       data: { status: "created" }
//     });
    
//   } catch (error) {
//     console.error("[Generate Content Error]", error);
//     // Update status to error
//     await db.studyMaterial.update({
//       where: { id: studyMaterialId },
//       data: { status: "error" }
//     });
//   }
// }

// async function generateChapters(studyMaterialId: string, materialLayout: any, model: any) {
//   for (let i = 0; i < materialLayout.chapters.length; i++) {
//     const chapter = materialLayout.chapters[i];
    
//     const prompt = `
//       Generate detailed study notes for the chapter: "${chapter.chapter_name}".
//       Chapter Summary: ${chapter.chapter_summary}.
//       Topics Covered:
//       - ${chapter.topics.join("\n- ")}
      
//       Provide structured and well-formatted content in a student-friendly way.
//       Include examples, diagrams descriptions, and practice exercises where appropriate.
//     `;
    
//     const chatSession = model.startChat({ history: [] });
//     const result = await chatSession.sendMessage(prompt);
//     let responseText = result.response.text();
//     responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
    
//     // Store the generated chapter notes in the database
//     await db.studyChapter.create({
//       data: {
//         CourseId: studyMaterialId,
//         notes: responseText,
//         orderIndex: i,
//       },
//     });
//   }
// }

// async function generateFlashcards(studyMaterialId: string, materialLayout: any, model: any) {
//   // First create the flashcard set
//   const flashcardSet = await db.flashcardSet.create({
//     data: {
//       studyMaterialId,
//       createdby: (await db.studyMaterial.findUnique({
//         where: { id: studyMaterialId },
//         select: { createdby: true }
//       }))!.createdby,
//       title: `Flashcards: ${materialLayout.course_name}`,
//       description: `Flashcards for ${materialLayout.course_name}`,
//     },
//   });

//   // Generate 5-10 flashcards per chapter
//   for (const chapter of materialLayout.chapters) {
//     const prompt = `
//       Create 5 to 7 flashcards for studying "${chapter.chapter_name}".
//       Topics include: ${chapter.topics.join(", ")}.

//       For each flashcard, provide:
//       1. A front side with a question, term, or concept
//       2. A back side with the answer, definition, or explanation
//       3. A difficulty rating from 1-5 (1 being easiest, 5 being hardest)
//       4. Up to 3 tags relating to the content

//       Format the response as a JSON array:
//       [
//         {
//           "front": "Question or term here",
//           "back": "Answer or definition here",
//           "difficulty": 2,
//           "tags": ["tag1", "tag2"]
//         },
//         // more flashcards...
//       ]
//     `;

//     const chatSession = model.startChat({ history: [] });
//     const result = await chatSession.sendMessage(prompt);
//     let responseText = result.response.text();

//     // Clean the response and extract JSON
//     responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
//     const jsonMatch = responseText.match(/\[[\s\S]*\]/);

//     if (jsonMatch) {
//       const flashcardsData = JSON.parse(jsonMatch[0]);

//       // Create each flashcard in the database
//       for (const card of flashcardsData) {
//         await db.flashcard.create({
//           data: {
//             flashcardSetId: flashcardSet.id,
//             front: card.front,
//             back: card.back,
//             difficulty: card.difficulty || 1,
//             tags: card.tags as Prisma.Json, // Store as JSON array
//           },
//         });
//       }
//     }
//   }
// }


// async function generateQuiz(studyMaterialId: string, materialLayout: any, model: any) {
//   // First create the quiz
//   const quiz = await db.quiz.create({
//     data: {
//       studyMaterialId,
//       createdby: (await db.studyMaterial.findUnique({
//         where: { id: studyMaterialId },
//         select: { createdby: true }
//       }))!.createdby,
//       title: `Quiz: ${materialLayout.course_name}`,
//       description: `Comprehensive quiz covering ${materialLayout.course_name}`,
//       timeLimit: 30, // 30 minutes default
//       passingScore: 70, // 70% passing score
//     },
//   });
  
//   // Generate 3-5 questions per chapter
//   let questionIndex = 0;
//   for (const chapter of materialLayout.chapters) {
//     const prompt = `
//       Create 3-5 quiz questions for "${chapter.chapter_name}".
//       Topics include: ${chapter.topics.join(", ")}.
      
//       Include a mix of multiple choice and true/false questions.
      
//       Format the response as a JSON array:
//       [
//         {
//           "questionText": "The question text here",
//           "questionType": "MultipleChoice", // or "TrueFalse"
//           "options": ["Option A", "Option B", "Option C", "Option D"], // for multiple choice
//           "correctAnswer": "The correct answer exactly as it appears in options",
//           "explanation": "Explanation of why this is the correct answer",
//           "points": 2 // point value
//         },
//         // more questions...
//       ]
//     `;
    
//     const chatSession = model.startChat({ history: [] });
//     const result = await chatSession.sendMessage(prompt);
//     let responseText = result.response.text();
    
//     // Clean the response and extract JSON
//     responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
//     const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
//     if (jsonMatch) {
//       const questionsData = JSON.parse(jsonMatch[0]);
      
//       // Create each question in the database
//       for (const question of questionsData) {
//         await db.quizQuestion.create({
//           data: {
//             quizId: quiz.id,
//             questionText: question.questionText,
//             questionType: question.questionType,
//             options: question.options || null,
//             correctAnswer: question.correctAnswer,
//             explanation: question.explanation || null,
//             points: question.points || 1,
//             orderIndex: questionIndex++,
//           },
//         });
//       }
//     }
//   }
// }

// async function generateQA(studyMaterialId: string, materialLayout: any, model: any) {
//   // First create the Q&A collection
//   const qaCollection = await db.qACollection.create({
//     data: {
//       studyMaterialId,
//       createdby: (await db.studyMaterial.findUnique({
//         where: { id: studyMaterialId },
//         select: { createdby: true }
//       }))!.createdby,
//       title: `Q&A: ${materialLayout.course_name}`,
//       description: `Common questions and answers for ${materialLayout.course_name}`,
//     },
//   });
  
//   // Generate Q&A pairs for each chapter
//   let pairIndex = 0;
//   for (const chapter of materialLayout.chapters) {
//     const prompt = `
//       Create 5-7 question and answer pairs for "${chapter.chapter_name}".
//       Topics include: ${chapter.topics.join(", ")}.
      
//       Include frequently asked questions that students might have.
//       Provide comprehensive and clear answers.
      
//       Format the response as a JSON array:
//       [
//         {
//           "question": "Question text here?",
//           "answer": "Comprehensive answer here.",
//           "category": "Concept", // or "Application", "Definition", etc.
//           "difficulty": 2 // 1-5 scale
//         },
//         // more Q&A pairs...
//       ]
//     `;
    
//     const chatSession = model.startChat({ history: [] });
//     const result = await chatSession.sendMessage(prompt);
//     let responseText = result.response.text();
    
//     // Clean the response and extract JSON
//     responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
//     const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
//     if (jsonMatch) {
//       const qaPairsData = JSON.parse(jsonMatch[0]);
      
//       // Create each Q&A pair in the database
//       for (const pair of qaPairsData) {
//         await db.qAPair.create({
//           data: {
//             collectionId: qaCollection.id,
//             question: pair.question,
//             answer: pair.answer,
//             category: pair.category || null,
//             difficulty: pair.difficulty || 1,
//             orderIndex: pairIndex++,
//           },
//         });
//       }
//     }
//   }
// }