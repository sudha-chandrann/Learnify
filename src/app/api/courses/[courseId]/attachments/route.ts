import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
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

    const { url ,name} = await req.json();

    // Check if the course belongs to the user
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

    // Create the attachment
    const attachment = await db.attachment.create({
      data: {
        url,
        name: name || "Unnamed Attachment",
        courseId: courseId,
      },
    });
    if(!attachment){
        return NextResponse.json(
            { error: "Failed to create attachment" },
            { status: 500 }
        );
    }

    return NextResponse.json(attachment, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_ATTACHMENT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
