import { db } from "@/lib/db";
import { backendClient } from "@/lib/edgestore-server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
  

export async function DELETE(
  req:NextRequest,
  { params }: { params: Promise<{ attachmentId: string; courseId: string }>}
) {
  try {
    const { userId } = await auth();
    const {courseId,attachmentId}= await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId:userId
      },
    });

    if (!courseOwner ) {
      return NextResponse.json(
        { error: "Unauthorized access to this course" },
        { status: 403 }
      );
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id:attachmentId,
      },
    });

    if (!attachment || attachment.courseId !== courseId) {
      return NextResponse.json(
        { error: "Attachment not found or doesn't belong to this course" },
        { status: 404 }
      );
    }
    
    await backendClient.publicFiles.deleteFile({
      url: attachment.url,
    });


    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json(
      { message: "Attachment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COURSE_ATTACHMENT_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
