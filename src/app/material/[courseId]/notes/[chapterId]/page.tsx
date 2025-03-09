import { db } from '@/lib/db';
import React from 'react';
import ChapterCard from '../_components/ChapterCard';

async function ChapterPage({
  params
}: {
  params: {
    courseId: string,
    chapterId: string
  }
}) {
  const { chapterId } = params;
  
  const chapter = await db.studyChapter.findUnique({
    where: {
      id: chapterId
    },
    include: {
      course: true,
      // Include other related data as needed
    }
  });

  if (!chapter) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-red-500">Chapter not found</h1>
        <p className="mt-4">The chapter you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      {chapter.notes ? (
        <ChapterCard content={chapter.notes}/>
      ) : (
        <div className="container mx-auto py-8 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">No Content Available</h2>
            <p className="text-gray-500">This chapter doesn&apos;t have any notes yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChapterPage;