import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const {courseId}= await params;

    const body = await req.json();
    const { list } = body;

    if (!Array.isArray(list) || list.some(item => !item.id || typeof item.position !== "number")) {
      return NextResponse.json(
        { error: "Invalid input: Each item must have 'id' and 'position'" },
        { status: 400 }
      );
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

    const updates = list.map(item =>
      db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    );

    await db.$transaction(updates);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[Reorder Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
