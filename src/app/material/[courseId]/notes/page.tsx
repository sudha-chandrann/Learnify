import { db } from '@/lib/db';
import React from 'react';
import ChapterCard from './_components/ChapterCard';

interface PageProps {
  params: {
    courseId: string;
  };
}

async function NotesPage({ params }: PageProps) {
  const { courseId } = params;

  // Fetch chapter notes for the course
  const chapterNotes = await db.studyChapter.findMany({
    where: {
      CourseId: courseId,
    },
    orderBy: {
      orderIndex: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-6">
      
      {chapterNotes.length === 0 ? (
        <p className="text-gray-500">No notes available for this course yet.</p>
      ) : (
        <div className="space-y-4">
          {chapterNotes.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter}/>

          ))}
        </div>
      )}
    </div>
  );
}

export default NotesPage;