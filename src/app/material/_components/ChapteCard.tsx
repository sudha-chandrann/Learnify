"use client"
import { StudyChapter, StudyMaterial } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React from 'react'

 interface ChapterCardProps {
    studyMaterial:StudyMaterial,
    courseId:string
    chapter:StudyChapter

}


function ChapterCard({studyMaterial,courseId,chapter}:ChapterCardProps) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const materialLayout = studyMaterial?.materialLayout as any;
    const chapterData = materialLayout?.chapters[chapter.orderIndex+1] || {};
    const chapterName =
      chapterData.chapter_name || `Chapter ${chapter.orderIndex +1}`;
    const chapterSummary =
      chapterData.chapter_summary || "No summary available";
    const topics = chapterData.topics || [];
    
   const router=useRouter();

  return (
    <div
    onClick={()=>{router.push(`material/${courseId}/notes/${chapter.id}`)}}
    className="border border-gray-200 rounded-lg hover:border-blue-300 transition-all "
  >

      <div className="flex justify-between items-center p-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            {chapter.orderIndex+1}. {chapterName}
          </h3>
          <p className="text-gray-600 mt-1">{chapterSummary}</p>

          {topics.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mt-2">
                {topics
                  .slice(0, 3)
                  .map((topic: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
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
        <div className="text-sky-600">→</div>
      </div>
  </div>
  )
}

export default ChapterCard
