"use client";
import React, { useState } from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import { Chapter } from "@prisma/client";


interface DescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

function ChapterDescriptionForm({
  initialData,
  courseId,
  chapterId,
}: DescriptionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [isEditing, setIsEditing] = useState(false);


  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-4/5 min-w-[320px] p-4  bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter Description</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Description
            </>
          )}
        </Button>
      </div>


      {!isEditing && !initialData.description && (
        <p className="text-sm mt-2 text-slate-700 italic">No description</p>
      )}


    </div>
  );
}

export default ChapterDescriptionForm;
