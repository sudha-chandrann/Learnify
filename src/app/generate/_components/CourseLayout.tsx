"use client";
import { StudyMaterial } from "@prisma/client";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";
import CourseCard from "./CourseCard";

interface CourseLayoutProps {
  courses: StudyMaterial[];
}

function CourseLayout({ courses }: CourseLayoutProps) {
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
            Your created study materials will appear here. Start by creating
            your first study material.
          </p>
          <Link
            href="/create"
            className="mt-6 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
          >
            Create New Material
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseLayout;
