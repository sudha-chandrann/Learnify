"use client";
import { IconBadge } from "@/components/customui/IconBadge";
import { StudyMaterial } from "@prisma/client";
import { BookOpen, Clock, BarChart3,  Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GeneratingButton from "./GeneratingButton";

interface CourseLayoutProps {
  courses: StudyMaterial[];
}

function CourseLayout({ courses }: CourseLayoutProps) {
  // Function to truncate text with ellipsis

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Function to get a more visually appealing color based on difficulty level
  const getDifficultyColor = (level: string | null | undefined) => {
    if (!level) return "bg-sky-100 text-sky-700"; // Default color if level is null or undefined
    
    switch (level.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-700";
      case "moderate":
        return "bg-amber-100 text-amber-700";
      case "hard":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-sky-100 text-sky-700";
    }
  };

  // Function to get a more visually appealing color based on material type
  const getMaterialTypeColor = (type: string | null | undefined) => {
    if (!type) return "bg-gray-100 text-gray-700"; // Default color if type is null or undefined
    
    switch (type.toLowerCase()) {
      case "exam":
        return "bg-purple-100 text-purple-700";
      case "job interview":
        return "bg-blue-100 text-blue-700";
      case "course":
        return "bg-teal-100 text-teal-700";
      case "coding prep":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
 


  return (
    <div className="container mx-auto py-8">
      {courses.length < 1 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 w-full bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="rounded-full bg-slate-100 p-6 mb-4">
            <BookOpen className="h-10 w-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Study Materials Found
          </h3>
          <p className="text-base text-slate-500 max-w-md mx-auto">
            Your created study materials will appear here. Start by creating your first study material.
          </p>
          <Link 
            href="/create" 
            className="mt-6 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
          >
            Create New Material
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            // Get course data safely
            const materialLayout = typeof course.materialLayout === 'object' ? course.materialLayout : null;
            const courseTitle = materialLayout && ('courseTitle' in materialLayout 
              ? materialLayout.courseTitle as string 
              : materialLayout && 'course_title' in materialLayout
                ? materialLayout.course_title as string
                : materialLayout && 'course_name' in materialLayout
                  ? materialLayout.course_name as string
                  : course.topic);
            
            const courseSummary = materialLayout && ('courseSummary' in materialLayout 
              ? materialLayout.courseSummary as string 
              : materialLayout && 'course_summary' in materialLayout
                ? materialLayout.course_summary as string
                : "");
              
            const chapters = materialLayout && ('chapters' in materialLayout 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? materialLayout.chapters as any[] 
              : []);
            
            const chaptersCount = chapters?.length || 0;
            const isGenerating = course.status === "generating";
            
            return (
              <div
                key={course.id}
                className="block h-full"
              >
                <div className="group h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src="/bg.jpg"
                      alt={courseTitle || "Course"}
                      width={500}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start">
                      <div className={`${getMaterialTypeColor(course.materialType)} text-xs font-medium px-3 py-1 rounded-full`}>
                        {course.materialType || "Unknown Type"}
                      </div>
                      <div className={`${getDifficultyColor(course.difficultyLevel)} text-xs font-medium px-3 py-1 rounded-full`}>
                        {course.difficultyLevel || "Unknown Level"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col p-5 flex-grow">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-sky-700 transition line-clamp-2 mb-2">
                      {courseTitle || "Untitled Course"}
                    </h3>
                    
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                      {truncateText(courseSummary || "", 150)}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100 mt-auto">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-x-2">
                          <IconBadge icon={BookOpen} size="sm" />
                          <span className="text-sm text-slate-700">
                            {chaptersCount} {chaptersCount === 1 ? "Chapter" : "Chapters"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-x-2">
                          <IconBadge icon={BarChart3} size="sm" />
                          <span className="text-sm text-slate-700">
                            {course.difficultyLevel || "Unknown Level"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-x-2 col-span-2 mt-2">
                          <IconBadge icon={Clock} size="sm" />
                          <span className="text-sm text-slate-700">
                            Created {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      {isGenerating ? (
                       <GeneratingButton courseid={course.id}/>
                      ) : (
                        <Link 
                          href={`/generate/${course.id}`}
                          className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          View Course
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseLayout;