import { db } from '@/lib/db';
import React from 'react';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CourseIntro from '../_components/CourseIntro';

interface PageProps {
  params: {
    courseId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const studyMaterial = await db.studyMaterial.findUnique({
    where: {
      id: params.courseId,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;

  return {
    title: materialLayout?.course_name || studyMaterial?.topic || 'Study Material',
    description: materialLayout?.course_summary || `${studyMaterial?.topic} study material`,
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
  if(!studyMaterial){
    return redirect("/generate")
  }

  // Fetch all chapters for this course
  const chapters = await db.studyChapter.findMany({
    where: {
      CourseId: courseId,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;


  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Link href="/generate" className="flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6 ">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Study Materials
      </Link>
      
     <CourseIntro studyMaterial={studyMaterial} chapterlenght={chapters.length}/>

      {/* Chapters list */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          
          {chapters.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">No chapters available for this study material.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter, index) => {
                const chapterData = materialLayout?.chapters[index] || {};
                const chapterName = chapterData.chapter_name || `Chapter ${index + 1}`;
                const chapterSummary = chapterData.chapter_summary || "No summary available";
                const topics = chapterData.topics || [];
                
                return (
                  <div 
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
                  >
                    <Link
                      href={`/study/${courseId}/chapter/${chapter.id}`}
                      className="block p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {index + 1}. {chapterName}
                          </h3>
                          <p className="text-gray-600 mt-1">{chapterSummary}</p>
                          
                          {topics.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-2 mt-2">
                                {topics.slice(0, 3).map((topic: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    {topic}
                                  </span>
                                ))}
                                {topics.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    +{topics.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-blue-600">→</div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyChaptersPage;