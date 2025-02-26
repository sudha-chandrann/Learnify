"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FileVideo, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";
import FileUploader from "@/components/customui/ImageUpload";


interface ChapterVideoFormProps {
  initialData: Chapter & {muxData?:MuxData|null}
  courseId: string;
  chapterId: string;
}

interface formSchema {
  videoUrl: string
}


function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) {


  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values:formSchema) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating chapter Video :", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-4/5 min-w-[320px] p-4 bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter Video</span>
        <Button variant="ghost" onClick={toggleEdit} >
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Chapter Video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Chapter Video
            </>
          )}
        </Button>
      </div>

      {!isEditing && initialData.videoUrl && (
        <div className="p-2 shadow-md rounded-md  w-full h-fit">
          <div className="relative aspect-video mt-2">
            <MuxPlayer
            playbackId={initialData?.muxData?.playbackId||""}
            /> 
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Videos can take a few minutes to process. Refresh the page if video does not appear.
          </div>

          
        </div>
      )}
      {!isEditing && !initialData.videoUrl && (
        <div className="flex items-center shadow-md rounded-md justify-center w-full h-40">
          <FileVideo className="w-20 h-20 text-slate-400 mb-2" />
        </div>
      )}

      {isEditing && (
        <div>
          <FileUploader
            isImage={false}
            onChange={(info) => {
              if (typeof info === "object" && "url" in info) {
                console.log(" the file is ",info)
                onSubmit({ videoUrl: info.url });
              } else {
                console.error("Invalid info type:", info);
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

    </div>
  );
}

export default ChapterVideoForm;
