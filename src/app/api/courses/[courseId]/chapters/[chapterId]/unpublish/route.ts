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


        if (!courseId || !chapterId) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const chapter = await db.chapter.findUnique({
            where: { id: chapterId, courseId:courseId },
        });

        if(!chapter ){
            return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
        }
  
        const updatedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: false,
            },
        });
        
        const publishedchapters=await db.chapter.findMany({
            where: { courseId: courseId, isPublished: true },
          })
      
          if(!publishedchapters.length){
            await db.course.update({
              where: { id: courseId },
              data: {
                isPublished: false
              }
              })
          }
      


        return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
        console.error("[Chapter_ID_UnPublish_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
