"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChapterFormProps {
  initialData: Course &{ chapters : Chapter[] } ;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

function ChapterForm({ initialData, courseId }: ChapterFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      console.error("Error updating Description:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-[380px] md:w-[450px] p-4 px-6 bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Course Chapters</span>
        <Button
          variant="ghost"
          onClick={toggleCreating}
          disabled={isSubmitting}
        >
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              variant="teacher"
              size="sm"
            >
              {isSubmitting ? "Saving..." : "Create Chapter"}
            </Button>
          </form>
        </Form>
      )}
      {
        !isCreating && (
            <div className={cn(
                "text-sm mt-2",
                !initialData.chapters.length && "text-slate-500 italic"
            )}>
                { !initialData.chapters.length && "No chapters" }
            </div>
        )
      }
      {
        !isCreating && (
          <p className="text-xs text-muted-foreground mt-2">
            Drag and drop to reorder the chapters
          </p>
        )
     }

    </div>
  );
}

export default ChapterForm;