import { db } from "@/lib/db";
import React from "react";
import { Metadata } from "next";
import { ArrowLeft, Delete, DeleteIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CourseIntro from "../_components/CourseIntro";
import StudyMaterial from "../_components/StudyMaterial";
import ChapterCard from "../_components/ChapteCard";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    courseId: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const studyMaterial = await db.studyMaterial.findUnique({
    where: {
      id: params.courseId,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;

  return {
    title:
      materialLayout?.course_name || studyMaterial?.topic || "Study Material",
    description:
      materialLayout?.course_summary ||
      `${studyMaterial?.topic} study material`,
  };
}

async function StudyChaptersPage({ params }: PageProps) {
  const { courseId } = params;

  // Fetch the study material for general info
  const studyMaterial = await db.studyMaterial.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!studyMaterial) {
    return redirect("/generate");
  }

  // Fetch all chapters for this course
  const chapters = await db.studyChapter.findMany({
    where: {
      CourseId: courseId,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });


  return (
    <div className="container mx-auto py-8 px-[5%] lg:px-[10%]">
      <div className="flex items-center justify-between mb-2">
        {/* Back button */}
        <Link
          href="/generate"
          className="flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6 "
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Study Materials
        </Link>
        <Button>
        <TrashIcon/> Delete 
        </Button>
      </div>

      <CourseIntro
        studyMaterial={studyMaterial}
        chaptersCount={chapters.length}
      />
      {/*Study Materials */}
      <StudyMaterial courseId={courseId} />

      {/* Chapters list */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-sky-600">
            Course Chapters/Notes
          </h2>

          {chapters.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">
                No chapters available for this study material.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  courseId={courseId}
                  studyMaterial={studyMaterial}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyChaptersPage;
