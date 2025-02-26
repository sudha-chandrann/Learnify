import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request,{ params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { title } = body;
    const {courseId}= await params;
    if (!title || typeof title !== "string") {
      return new NextResponse("Invalid title", { status: 400 });
    }

    const courseOwner = await db.course.findUnique({
        where: {
          id: courseId,
          userId: userId, 
        },
      });
  
      if (!courseOwner) {
        return NextResponse.json(
          { error: "Unauthorized access to this course" },
          { status: 401 }
        );
      }
     const lastChapter = await db.chapter.findFirst({
        where: {
            courseId: courseId,
        },
        orderBy:{
            position:"desc"
        }
     });
    // Create a new chapter in the database
    const chapter = await db.chapter.create({
      data: {
        title: title,
        courseId: courseId,
        position:lastChapter? lastChapter.position+1:1
      },
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[chapter]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
