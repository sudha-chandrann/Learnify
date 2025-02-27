

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }>}
) {
    try {
        const { userId } = await auth();
        const {  chapterId } =await params;

        const body = await req.json();
        const { isCompleted } = body;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            },
            update: {
                isCompleted: isCompleted
            },
            create: {
                userId: userId,
                chapterId: chapterId,
                isCompleted: isCompleted
            }
        });


        return NextResponse.json(userProgress, { status: 200 });
    } catch (error) {
        console.error("[Chapter_ID_Progress_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

