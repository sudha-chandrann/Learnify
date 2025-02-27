"use client";
import { Category, Course } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { IconBadge } from "./IconBadge";
import { BookOpen, Star } from "lucide-react";
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
        <div className="flex flex-col items-center justify-center text-center py-10 w-full">
          <div className="rounded-full bg-slate-100 p-3 mb-4">
            <BookOpen className="h-6 w-6 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No courses found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or check back later</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link href={`/courses/${item.id}`} key={item.id} className="block">
            <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 rounded-xl h-full bg-white flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={item.imageUrl || ""}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {item.category?.name && (
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                    {item.category.name}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col p-4 flex-grow">
                <h3 className="text-lg font-medium text-slate-800 group-hover:text-sky-700 transition line-clamp-2 mb-1">
                  {item.title}
                </h3>
                
                <p className="text-sm text-slate-500 mb-2">
                  By {item?.author || "Unknown instructor"}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-x-2 mt-2 mb-3">
                    <IconBadge icon={BookOpen} size="sm" />
                    <span className="text-sm text-slate-700">
                      {item?.chapters?.length} {item?.chapters?.length === 1 ? "Chapter" : "Chapters"}
                    </span>
                  </div>
                  
                  {item.progress !== null ? (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-700">Your progress</span>
                        <span className="text-xs font-medium text-slate-700">
                          {Math.round(item.progress)}%
                        </span>
                      </div>
                      <CourseProgress
                        variant={item.progress === 100 ? "success" : "default"}
                        value={item.progress}
                        size={item.progress === 100 ? "success" : "default"}
                      />
                      {item.progress === 100 && (
                        <p className="text-xs text-emerald-700 mt-2 flex items-center gap-x-1">
                          <Star className="h-3 w-3" /> Course completed
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-base font-medium text-slate-900">
                      {formatPrice(item.price)}
                    </p>
                  )}
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