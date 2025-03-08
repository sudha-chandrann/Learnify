

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
    const { courseid,  materialType} = body;
    if (!courseid || !materialType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

 // Check if material exists based on type
 let isPresent = false;
    
 switch (materialType) {
   case "notes":
     const chapters = await db.studyChapter.findMany({
       where: {
         CourseId: courseid
       }
     });
     isPresent = chapters.length > 0;
     break;
     
   case "flashcard":
     const flashcards = await db.flashcardSet.findUnique({
       where: {
         studyMaterialId: courseid
       }
     });
     isPresent = !!flashcards;
     break;
     
   case "quiz":
     const quiz = await db.quiz.findUnique({
       where: {
         studyMaterialId: courseid
       }
     });
     isPresent = !!quiz;
     break;
     
   case "question":
     const qACollection = await db.qACollection.findUnique({
       where: {
         studyMaterialId: courseid
       }
     });
     isPresent = !!qACollection;
     break;
     
   default:
     return new NextResponse("Invalid material type", { status: 400 });
 }

    return NextResponse.json({
      isPresent:isPresent
    });
    
  } catch (error) {
    console.error("[STUDY_MATERIAL_STATUS_CHECK]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
  }
