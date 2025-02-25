import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
  ) {
    try {
      const { userId } = await auth();
      const { courseId } = await params;
  
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 401 }
        );
      }
  
      const values = await req.json();
  
      const updatedCourse = await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          ...values,
        },
      });
  
      return NextResponse.json(updatedCourse, { status: 200 });
    } catch (error) {
      console.error("[COURSE_ID_PATCH_ERROR]", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  