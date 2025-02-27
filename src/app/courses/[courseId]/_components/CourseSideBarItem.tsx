'use client';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'


interface CourseSideBarItemProps {
    id:string;
    label:string;
    isCompleted:boolean;
    courseId:string;
    isLocked:boolean;
}


function CourseSideBarItem(
    {
        id,
        label,
        isCompleted,
        courseId,
        isLocked
    }:CourseSideBarItemProps
) {
      const pathname = usePathname();
      const router=useRouter();
      const Icon = isLocked ? Lock :( isCompleted? CheckCircle: PlayCircle )
      const isActive = pathname?.includes(id)
      const onClick =()=>{
        router.push(`/courses/${courseId}/chapters/${id}`)
      }

  return (
    <button
    type='button'
    className={cn(
        'flex items-center gap-x-2 text0slate-500 text-sm font-[500] pl-6  transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive && 'text-sky-700 bg-sky-200/60 hover:bg-sky-200/20 hover:text-sky-700',
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200 "
      )}
     onClick={onClick}>
    <div className='flex items-center gap-x-2 py-4'>
      <Icon
      size={22}
      className={cn(
        "text-slate-500 ",
        isCompleted && isActive &&"text-emerald-700",
        !isCompleted && isActive && "text-sky-700"
      )}
      />
      {label} 
    </div>
    <div className={cn(
        "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
        isActive && "opacity-100",
        isCompleted && "border-emerald-700"
    )}>

    </div>
    </button>

  )
}

export default CourseSideBarItem
