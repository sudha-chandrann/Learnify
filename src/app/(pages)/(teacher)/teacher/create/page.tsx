"use client";
import React from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required",
  }),
});

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router=useRouter();
  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try{
        const response=await axios.post("/api/courses",values);
        router.push(`/teacher/courses/${response.data.id}`); 
        toast.success("new course is created successfully")
        form.reset()
    }
    catch{
      toast.error("Something went wrong ");
    }
  };

  return (
    <div className="flex items-center justify-center h-full max-w-5xl mx-auto px-3 ">
      <div className="flex flex-col justify-between p-2  gap-2  ">
        <h1 className="text-lg">Name your course</h1>
        <p className="text-sm md:text-md text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

           
            <div className="flex items-center gap-x-2 w-full">
                <Button type="button" size="sm" onClick={()=> form.reset()} disabled={isSubmitting}>
                  Cancel
                </Button>
              <Button
                type="submit"
                 variant="teacher"
                 size="teacher"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
