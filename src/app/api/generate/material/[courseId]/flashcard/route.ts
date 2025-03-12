import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = params;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        if (!courseId) {
            return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
        }

        // Fetch the study material based on the courseId
        const studyMaterial = await db.studyMaterial.findUnique({
            where: { id: courseId },
            select: { id: true, createdby: true }
        });

        if (!studyMaterial) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        // Check if the user is the creator of the study material
        if (studyMaterial.createdby !== userId) {
            return NextResponse.json({
                message: 'Forbidden: You do not have permission to delete this study material'
            }, { status: 403 });
        }

        // Check if there's a related flashcard set
        const flashcardset = await db.flashcardSet.findUnique({
            where: { studyMaterialId: studyMaterial.id },
            select: { id: true, user: true }
        });

        if (!flashcardset) {
            return NextResponse.json({ message: "No flashcard set found" }, { status: 404 });
        }

        // Check if the user is the owner of the flashcard set
        if (flashcardset.user.id !== userId) {
            return NextResponse.json({
                message: 'Forbidden: You do not have permission to delete this flashcard material'
            }, { status: 403 });
        }

        // Delete the flashcard set
        await db.flashcardSet.delete({
            where: { id: flashcardset.id }
        });

        // Successfully deleted flashcard set and related data
        return NextResponse.json(
            { message: "Flashcard set and all related data deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting study material:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
