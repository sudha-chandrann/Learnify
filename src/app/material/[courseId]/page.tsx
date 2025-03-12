import { db } from "@/lib/db";
import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CourseIntro from "../_components/CourseIntro";
import StudyMaterial from "../_components/StudyMaterial";
import ChapterCard from "../_components/ChapteCard";
import DeleteButton from "../_components/DeleteButton";

interface ChapterProps {
  chapter_name: string;
  chapter_summary: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topics: any;
}

interface PageProps {
  params: {
    courseId: string;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;
  const chaptersData = materialLayout?.chapters || [];
  const chapterlenght = chaptersData.length;

  const chapter_number = await db.studyChapter.count({
    where: {
      CourseId: courseId,
    },
  });
  const allchaptercreated = chapter_number != chapterlenght;

  return (
    <>
{allchaptercreated && (
  <div className="bg-yellow-100 w-full h-12 fixed top-0 left-0 flex items-center justify-center text-yellow-900 font-semibold shadow-md z-50">
    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-800 animate-bounce" />
    First, create all chapters before adding any other materials.
    <AlertTriangle className="w-5 h-5 ml-2 text-yellow-800 animate-bounce" />
  </div>
)}

      <div className="container mx-auto py-16 px-[5%] lg:px-[10%]">
        <div className="flex items-center justify-between mb-2">
          {/* Back button */}
          <Link
            href="/generate"
            className="flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6 "
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Study Materials
          </Link>
          <DeleteButton courseId={courseId} />
        </div>

        <CourseIntro
          studyMaterial={studyMaterial}
          chaptersCount={chapterlenght}
        />
        {/*Study Materials */}
        <StudyMaterial courseId={courseId} />

        {/* Chapters list */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-600">
              Course Chapters/Notes
            </h2>

            {chaptersData.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">
                  No chapters available for this study material.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chaptersData.map((chapter: ChapterProps, index: number) => (
                  <ChapterCard
                    key={index}
                    chapter={chapter}
                    courseId={courseId}
                    studyMaterial={studyMaterial}
                    orderIndex={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudyChaptersPage;
