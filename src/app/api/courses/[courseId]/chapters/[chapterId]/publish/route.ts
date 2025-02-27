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

        const muxData = await db.muxData.findUnique({
            where: { chapterId:chapterId }
        })
        if(!muxData|| !chapter || !chapter.title || !chapter.description || !chapter.videoUrl){
            return NextResponse.json({ error: "Missing required fields" }, { status: 403 });
        }
  
        const updatedChapter = await db.chapter.update({
            where: {
                id:chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: true,
            },
        });


        return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
        console.error("[Chapter_ID_Publish_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
