"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmModel from "@/components/customui/ConfirmModel";


interface ChapterActionProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}




function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionProps) {
  const [isloading,setloading]=useState(false);
   const router= useRouter();
    const handleDelete = async () => {

        try {
          setloading(true)
          await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
          toast.success("chapter is  deleted successfully!");
          router.back();
        } catch (error) {
          console.error("Error deleting chapter:", error);
          toast.error("Something went wrong. Please try again.");
        }
        finally{
          setloading(false)
        }
    };
 
   console.log(disabled,isPublished)
   


  return (
    <div className="flex items-center gap-x-2">

      <ConfirmModel
         isCourse={false}
         onConfirm={async () => {
             handleDelete();
          }}
      >
      <Button size="sm" disabled={isloading}>
        <Trash className="w-4 h-4"/>
      </Button>
      </ConfirmModel>

    </div>
  );
}

export default ChapterActions;
