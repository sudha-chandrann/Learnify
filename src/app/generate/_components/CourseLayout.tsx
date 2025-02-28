import { IconBadge } from "@/components/customui/IconBadge";
import { StudyMaterial } from "@prisma/client";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CourseLayoutProps {
  courses: StudyMaterial[];
}

function CourseLayout({ courses }: CourseLayoutProps) {
  return (
    <div className="">
      {courses.length < 1 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 w-full">
                <div className="rounded-full bg-slate-100 p-3 mb-4">
                  <BookOpen className="h-6 w-6 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No Material found</h3>
                <p className="text-sm text-slate-500 mt-1">Start creating new materials</p>
              </div>
      ) : (
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
                      <Link href={`/generate/${course.id}`} key={course.id} className="block">
                      <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 rounded-xl h-full bg-white flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                          {course.topic && (
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                              {course.topic}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col p-4 flex-grow">
                          <h3 className="text-lg font-medium text-slate-800 group-hover:text-sky-700 transition line-clamp-2 mb-1">
                            {course.topic}
                          </h3>
                          
                          
                          <div className="mt-auto">
                            <div className="flex items-center gap-x-2 mt-2 mb-3">
                              <IconBadge icon={BookOpen} size="sm" />
                              <span className="text-sm text-slate-700">
                                {course.materialLayout?.toLocaleString().length} {course.materialLayout?.toLocaleString().length === 1 ? "Chapter" : "Chapters"}
                              </span>
                            </div>
                            

                          </div>
                        </div>
                      </div>
                    </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseLayout;
