"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FileUploader from "@/components/customui/ImageUpload";

interface CourseImageFormProps {
  initialData: {
    imageUrl: string;
  };
  courseId: string;
}



function ImageForm({ initialData, courseId }: CourseImageFormProps) {


  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();



  const onSubmit = async (values:{imageUrl:string}) => {
    try {
      setisLoading(true);
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Image updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating Course Image:", error);
      toast.error("Something went wrong. Please try again.");
    }
    finally{
        setisLoading(false);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-4/5 min-w-[320px]  p-3 md:p-4  bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between mb-2">
        <span>Course Image</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isLoading}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Course Image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Course Image
            </>
          )}
        </Button>
      </div>

      {!isEditing && initialData.imageUrl && (
        
        <div className="flex items-center p-2 shadow-md rounded-md justify-center w-full h-fit">
          <Image
            width="100"
            height="600"
            src={initialData.imageUrl}
            alt="image"
            className="w-[400px] h-[200px] rounded-md object-cover object-center"
          />
        </div>
      )}
      {!isEditing && !initialData.imageUrl && (
         <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 h-[200px]">
         <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
         <p className="text-slate-500 text-center">No image uploaded yet</p>
       </div>
      )}

      {isEditing && (
        <div className="flex flex-col items-center justify-center  border-slate-300 rounded-lg h-[260px]">
          <FileUploader  onChange={(info) => {
              if (typeof info === "object" && "url" in info) {
                onSubmit({ imageUrl: info.url });
              } else {
                console.error("Invalid info type:", info);
              }
            }} isImage={true}/>
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageForm;
