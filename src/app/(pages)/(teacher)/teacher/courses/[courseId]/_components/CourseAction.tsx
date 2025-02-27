"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmModel from "@/components/customui/ConfirmModel";


interface CourseActionProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

function CourseActions({
  disabled,
  courseId,
  isPublished,
}: CourseActionProps) {
   const router= useRouter();
   const [isloading,setloading]=useState(false);
    const handleDelete = async () => {
        try {
          setloading(true);
          await axios.delete(`/api/courses/${courseId}`);
          toast.success("course is  deleted successfully!");
          router.push("/teacher/courses");
        } catch (error) {
          console.error("Error deleting course:", error);
          toast.error("Something went wrong. Please try again.");
        }
        finally{
          setloading(false);
        }
      };

      const handleTooglepublish = async () => {
        try {
          setloading(true);
          if(isPublished){
            await axios.patch(`/api/courses/${courseId}/unpublish`)
            toast.success("course is  unpublished successfully!");
          }
          else{
            await axios.patch(`/api/courses/${courseId}/publish`)
            toast.success("course is  published successfully!");
            
          }
          router.refresh();
        } catch (error) {
          console.error("Error updating publishing:", error);
          toast.error("Something went wrong. Please try again.");
        }
        finally{
          setloading(false);
        }
      };
      


  return (
    <div className="flex items-center gap-x-2">
                <Button
        variant="teacher"
        size="sm"
        onClick={async () => {
            handleTooglepublish();
         }}
        disabled={disabled || isloading}
      ></Button>
      <ConfirmModel
         isCourse={true}
         onConfirm={async () => {
             handleDelete();
         }}
      >
      <Button size="sm" disabled={isloading} >
        <Trash className="w-4 h-4"/>
      </Button>
      </ConfirmModel>

    </div>
  );
}

export default CourseActions;
