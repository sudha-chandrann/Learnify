import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID as string,
    tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});


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
  
      // Parse and validate request body
      const {  ...values } = await req.json();
  
      // Verify the user owns the course before allowing updates
      const course = await db.course.findUnique({
        where: { id: courseId, userId },
      });
  
      if (!course) {
        console.log(" the course is missing")
        return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
      }
      if(values.videoUrl){
        const chapter=await db.chapter.findUnique({
            where: { id: chapterId },
        })
        if(!chapter){
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }
        if(chapter.videoUrl){
            try {
                const publicId = chapter.videoUrl.split("/").pop()?.split(".")[0];
                if (publicId) {
                  await cloudinary.uploader.destroy(publicId);
                }
              } catch (error) {
                console.error(`Failed to delete video ${chapter.videoUrl} from Cloudinary`, error);
                return NextResponse.json(
                  { error: "Internal Server Error" },
                  { status: 500 }
                );
            }
        }

      }


      // Update the chapter with provided values
      const updatedChapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          ...values,
        },
      });

      if (values.videoUrl) {

        try {
          // Check if Mux data already exists for this chapter
          const existingMuxData = await db.muxData.findFirst({
            where: {
              chapterId: chapterId,
            },
          });
  
          // If Mux data exists, delete the old asset and record
          if (existingMuxData) {
            await mux.video.assets.delete(existingMuxData.assetId);
            await db.muxData.delete({
              where: {
                id: existingMuxData.id,
              },
            });
          }
  
          const asset = await mux.video.assets.create({
            input: values.videoUrl,
            playback_policy: ["public"],
            test: false,
          });
  
  
          await db.muxData.create({
            data: {
              chapterId: chapterId,
              assetId: asset.id,
              playbackId: asset.playback_ids?.[0]?.id || null,
            },
          });
  
        } catch (muxError) {
          console.error("[MUX_ASSET_ERROR]", muxError);
          return NextResponse.json(
            { error: "Failed to process video upload" },
            { status: 500 }
          );
        }
      }
  
  
      return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
      console.error("[COURSE_ID_PATCH_ERROR]", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  