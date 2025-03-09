import { db } from '@/lib/db';
import React from 'react';
import SideBarRoutes from './SideBarRoutes';
import { redirect } from 'next/navigation';
import { BookOpen } from 'lucide-react';

async function NotesSideBar({ courseId }: { courseId: string }) {
  const studyMaterial = await db.studyMaterial.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!studyMaterial) {
    return redirect(`/material/${courseId}`);
  }

  const chapterNotes = await db.studyChapter.findMany({
    where: {
      CourseId: courseId,
    },
    orderBy: {
      orderIndex: 'asc',
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;
  const courseName = materialLayout?.course_name || studyMaterial?.topic || 'Untitled Course';

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-md '>
      <div className='flex gap-x-2 p-4 items-center border-b'>
        <div className='w-[20%] flex items-center p-4 justify-center bg-sky-100 rounded-full'>
        <BookOpen className='text-sky-700 text-4xl '/>
        </div>
        
      <h2 className="text-md font-semibold text-sky-800 ">
        {courseName|| 'Course Notes'}
      </h2>
      </div>

      <div className='flex flex-col w-full'>
        {chapterNotes.map((chapter) => (
          <SideBarRoutes
            key={chapter.id}
            chapter={chapter}
            courseId={courseId}
            studyMaterial={studyMaterial}
          />
        ))}
      </div>
    </div>
  );
}

export default NotesSideBar;