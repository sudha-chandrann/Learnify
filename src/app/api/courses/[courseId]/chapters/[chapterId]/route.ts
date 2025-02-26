import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
  ) {
    try {
      const { userId } = await auth();
      const {courseId,chapterId}= await params;
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
  
      // Parse and validate request body
      const {  ...values } = await req.json();
  
      // Verify the user owns the course before allowing updates
      const course = await db.course.findUnique({
        where: { id: courseId, userId },
      });
  
      if (!course) {
        console.log(" the course is missing")
        return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
      }
      // Update the chapter with provided values
      const updatedChapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          ...values,
        },
      });
  
      return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
      console.error("[COURSE_ID_PATCH_ERROR]", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  