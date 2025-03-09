import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        if (!courseId) {
            return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
        }
        const studyMaterial = await db.studyMaterial.findUnique({
            where: { id: courseId },
            select: { id: true, createdby: true }
        });
        if (!studyMaterial) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }
        if (studyMaterial.createdby !== userId) {
            return NextResponse.json({
                error: 'Forbidden: You do not have permission to delete this study material'
            }, { status: 400 });
        }
          await db.studyMaterial.delete({
            where: { id: courseId },
          })

        return NextResponse.json(
            { message: "Course and all related data deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting study material:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}







