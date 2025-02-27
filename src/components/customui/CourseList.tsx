"use client";
import { Category, Course } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { IconBadge } from "./IconBadge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import CourseProgress from "./Courseprogress";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

function CoursesList({ items }: CourseListProps) {
  return (
    <div className="w-full p-4 px-7">
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10 w-full">
          No Courses found
        </div>
      )}
      <div className="w-full  grid grid-cols-1  gap-x-6 gap-y-4 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
         <Link href={`/courses/${item.id}`}  key={item.id}>
        <div
           
            className="group hover:shadow-lg transition overflow-hidden border border-slate-300 rounded-lg p-3 w-full "
          >
            <div className=" w-full aspect-video rounded-md overflow-hidden">
              <Image
                src={item.imageUrl || ""}
                alt={item.title}
                width={300}
                height={200}
                className="w-full object-center object-cover"
              />
            </div>
            <div className="flex flex-col pt-2">
              <div className="text-lg md:text-base font-medium text-slate-800 group-hover:text-sky-700 transition line-clamp-2">
                {item.title}
              </div>
              <p className="text-xs text-muted-foreground ">
                {item?.category?.name}
              </p>
              <p className="text-xs text-muted-foreground ">
                Author: {item?.author}
              </p>
              <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                <div className="flex items-center gap-x-1 text-slate-500">
                  <IconBadge icon={BookOpen} size="sm" />
                  <div className=" flex items-center gap-x-1 text-sm ">
                    {item?.chapters?.length}
                    <span className="">
                      {item?.chapters?.length >= 1 ? "Chapters" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-8">

              {
                (item.progress !== null ) ? (  
                         <CourseProgress
                          variant={item.progress === 100 ? "success": "default"}
                          value={item.progress}
                          size={item.progress === 100 ? "success": "default"}
                         />
                ):(
                    <p className="text-sm text-slate-700">
                      {formatPrice(item.price)}
                    </p>
                )
              }
              </div>


            </div>
          </div>
         </Link>   

        ))}
      </div>
    </div>
  );
}

export default CoursesList;
