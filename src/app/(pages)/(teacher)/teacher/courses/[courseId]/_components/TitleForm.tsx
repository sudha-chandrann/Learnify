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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

function TitleForm({ initialData, courseId }: TitleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting ,isValid} = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const router=useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Title updated successfully!");
      setIsEditing(false); 
      router.refresh();
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-4/5 min-w-[320px]  p-3 md:p-4  bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Course Title</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={!isValid || isSubmitting}>
          {isEditing ? "Cancel" : <><Pencil className="h-4 w-4 mr-2" /> Edit Title</>}
        </Button>
      </div>

      {!isEditing && <p className="text-sm mt-2 text-slate-700">{initialData.title}</p>}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={initialData.title}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={isSubmitting || !isValid} variant="teacher" size="sm">
              {isSubmitting ? "Saving..." : "Save Title"}
            </Button>
            </div>

          </form>
        </Form>
      )}
    </div>
  );
}

export default TitleForm;
