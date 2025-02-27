
import NavRoutes from '@/components/customui/NavRoutes';
import { auth } from '@clerk/nextjs/server';
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation';
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import CourseSideBar from './CourseSideBar';
interface CourseNavBarprops {
    course:Course & {
        chapters:(Chapter & {
            userProgress:UserProgress[] | null;
        })[]
    },
    progresscount:number
}

async function CourseNavBar({course,progresscount}:CourseNavBarprops) {
   const {userId}= await auth();
   if(!userId){
    return redirect("/");
   }

  return (
    <div className='h-full shadow-md w-full flex px-3  items-center '>
     <div className='md:hidden'>
        <Sheet>
            <SheetTrigger>
                <Menu/>
            </SheetTrigger>
            <SheetContent side="left">
                <CourseSideBar course={course} progresscount={progresscount}/>
            </SheetContent>
        </Sheet>
        
       </div>
     <NavRoutes/>
    </div>
  )
}

export default CourseNavBar
