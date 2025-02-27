import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";




export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }
        const { courseId } = await params;
        const course = await db.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        const purchase = await db.purchase.create({
            data: {
                courseId: courseId,
                userId: userId,
                price: course?.price,
            }
        })
        if (!purchase) {
            return NextResponse.json({ error: "Failed to purchase course" }, { status: 500 })
        }
        return NextResponse.json(purchase, { status: 200 });
    } catch (error) {
        console.error("[COURSE_ID_PATCH_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}



