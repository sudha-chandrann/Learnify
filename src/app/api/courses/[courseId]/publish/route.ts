import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const {courseId}= await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    const courseOwner=await db.course.findUnique({
        where: { id: courseId,userId },
    })
    const publishedchapters=await db.chapter.findMany({
        where: { courseId: courseId, isPublished: true },
    })
  
    if(!courseOwner || !courseOwner.title || !courseOwner?.description || !courseOwner.imageUrl || !courseOwner.categroyId ||  !publishedchapters.length){
        return NextResponse.json(
            { error: "some required fields are missing" },
            { status: 401 }
            );
    }
    
    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished:true,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_publish_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
