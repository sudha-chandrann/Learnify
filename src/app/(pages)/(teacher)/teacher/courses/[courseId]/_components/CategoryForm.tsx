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
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";

interface categroyFormProps {
  initialData:{
    categroyId:string| null
  };
  options:{label:string; value:string}[];
  courseId: string;
}

const formSchema = z.object({
    categroyId: z.string().min(1, { message: "categroy is required" }).nullable(),
});

function CategoryForm({ initialData, courseId,options }: categroyFormProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{ 
     categroyId: initialData.categroyId??""
    },
  });

  const { isSubmitting ,isValid} = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const router=useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Category is  updated successfully!");
      setIsEditing(false); 
      router.refresh();
    } catch (error) {
      console.error("Error updating Description:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const toggleEdit = () => setIsEditing((current) => !current);
  const selectedOption=options.find((option)=>option.value ===  initialData.categroyId)

  return (
    <div className="w-full lg:w-4/5 min-w-[320px]  p-3 md:p-4  bg-slate-100 rounded-md  mb-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Category</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
          {isEditing ? "Cancel" : <><Pencil className="h-4 w-4 mr-2" /> Edit Category</>}
        </Button>
      </div>

      {!isEditing && initialData.categroyId && <p className="text-sm mt-2 text-slate-700">{selectedOption?.label}</p>}
      {!isEditing && !initialData.categroyId && <p className="text-sm mt-2 text-slate-700 italic">No category</p>}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="categroyId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                    options={options}
                    {...field} 
                    value={field.value??undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={isSubmitting || !isValid} variant="teacher" size="sm">
              {isSubmitting ? "Saving..." : "Save category"}
            </Button>
            </div>

          </form>
        </Form>
      )}
    </div>
  );
}

export default CategoryForm;
