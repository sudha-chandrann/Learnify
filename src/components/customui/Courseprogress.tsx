import React from "react";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?:"default" |"success";
  size?:"default" |"success"
}


const colorByVariant={
  "default": "text-sky-500",
  "success": "text-emerald-500",
}
const sizeByVariant={
  "default": "text-sm",
  "success": "text-xs",
}


function CourseProgress({ value,variant,size }:CourseProgressProps) {
  return (
    <div>
     <Progress
     value={value}
     className={cn("h-2 bg-sky-300",variant&&`${colorByVariant[variant]}`)}
     />
     <p className={cn("font-medium mt-2 text-sky-700", variant && colorByVariant[variant], size && sizeByVariant[size])}>
      {Math.round(value)}% Complete
     </p>
    </div>
  )
  ;
}

export default CourseProgress;
