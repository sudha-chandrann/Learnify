import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Mux from "@mux/mux-node";
import { backendClient } from "@/lib/edgestore-server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});









export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!courseId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
        attachments: true,
      },
    });

    if (!course || course.userId !== userId) {
      return NextResponse.json({ error: "Course not found or access denied" }, { status: 403 });
    }

    // Delete all Mux video assets linked to the chapters
    for (const chapter of course.chapters) {

      // Delete chapter video from Cloudinary
      if (chapter.videoUrl) {
        try {
          const publicId = chapter.videoUrl.split("/").pop()?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId,{ resource_type: 'video' });
          }
        } catch (error) {
          console.error(`Failed to delete video ${chapter.videoUrl} from Cloudinary`, error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }
      }


      if (chapter.muxData?.assetId) {
        try {
          await mux.video.assets.delete(chapter.muxData.assetId);
        } catch (error) {
          console.error(`Failed to delete Mux asset ${chapter.muxData.assetId}`, error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }
      }


    }

    // Delete all attachments related to the course
    for (const attachment of course.attachments) {
      if (attachment.url) {
        try {
          // Replace this with your backend file deletion logic
          await backendClient.publicFiles.deleteFile({
            url: attachment.url,
          });
        } catch (error) {
          console.error(`Failed to delete file ${attachment.url}`, error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }
      }
    }
    // Delete course image from Cloudinary
    if (course.imageUrl) {
      try {
        const publicId = course.imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image ${publicId} from Cloudinary`);
        }
      } catch (error) {
        console.error(`Failed to delete image ${course.imageUrl} from Cloudinary`, error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
    // Delete the course record from the database
    await db.course.delete({
      where: { id: course.id },
    });

    return NextResponse.json(
      { message: "Course and all related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COURSE_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}





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
  



  