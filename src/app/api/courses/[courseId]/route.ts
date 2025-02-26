import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      if(values.imageUrl){
        const course=await db.course.findUnique({
            where: { id: courseId,userId },
        })
        if(!course){
            return NextResponse.json({ error: "course not found" }, { status: 404 });
        }
        if(course.imageUrl){
            try {
                const publicId = course.imageUrl.split("/").pop()?.split(".")[0];
                if (publicId) {
                  await cloudinary.uploader.destroy(publicId);
                }
              } catch (error) {
                console.error(`Failed to delete course Image ${course.imageUrl} from Cloudinary`, error);
                return NextResponse.json(
                  { error: "Internal Server Error" },
                  { status: 500 }
                );
            }
        }

      }
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
  

  