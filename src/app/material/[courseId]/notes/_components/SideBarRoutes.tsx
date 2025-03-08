"use client"
import { StudyChapter, StudyMaterial } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';

interface SideBarRoutesProps {
  chapter: StudyChapter;
  courseId: string;
  studyMaterial: StudyMaterial;
}

function SideBarRoutes({ chapter, courseId, studyMaterial }: SideBarRoutesProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;

  const chapterData = materialLayout?.chapters[chapter.orderIndex + 1] || {};
  const chapterName = chapterData.chapter_name || `Chapter ${chapter.orderIndex + 1}`;
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname?.includes(chapter.id)


  return (
    <button
     type='button'
      onClick={() => {
        router.push(`/material/${courseId}/notes/${chapter.id}`);
      }}
          className={cn(
              'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6  transition-all hover:text-sky-600 hover:bg-sky-300/20',
              isActive && 'text-emerald-700 bg-emerald-200/60 hover:bg-sky-200/20 hover:text-sky-700',
            )}
    >
          <div className='flex items-center gap-x-2 py-4'>
          <span className="flex items-center justify-center bg-sky-100 text-sky-600 rounded-full w-6 h-6 text-xs font-medium">
            {chapter.orderIndex + 1}
          </span>
            {chapterName} 
          </div>
          <div className={cn(
              "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
              isActive && "opacity-100",
          )}>

          </div>

    </button>
  );
}

export default SideBarRoutes;