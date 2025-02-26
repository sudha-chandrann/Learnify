"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ChapterAccessProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!(initialData.isFree),
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Description updated successfully!");
      setIsEditing(false);
      router.refresh();

    } catch (error) {
      console.error("Error updating Description:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-4/5 min-w-[320px] p-4  bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter access </span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className={cn("text-sm mt-2",!initialData.isFree && "text-slate-500 italic")}>
          {
            initialData.isFree ?(
                <>This chapter is free for preview.</>
            ):(
                <>This chapter is not free for preview.</>
            )
          }
        </div>
      )}

      {isEditing && (

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 w-full  mx-auto"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                   <FormControl>
                    <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                   </FormControl>
                   <div className="space-y-1 leading-none">
                    <FormDescription>
                        Check this box if you want to make this chapter free 
                        for preview
                    </FormDescription>
                   </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 justify-between">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                variant="teacher"
                size="sm"
              >
                {isSubmitting ? "Saving..." : "Save Access"}
              </Button>
            </div>
          </form>
        </Form>
     
      )}
      
    </div>
  );
}

export default ChapterAccessForm;
