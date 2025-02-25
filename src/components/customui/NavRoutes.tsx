'use client'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';


function NavRoutes() {
    const pathname=usePathname();

    const isTeacherPage=pathname?.startsWith("/teacher");
    const isCoursePage=pathname?.includes("/courses");


  return (
    <>

        <div className='flex gap-x-3 ml-auto'>
        {
            isTeacherPage || isCoursePage ?
            (
            <Link href="/dashboard">
                <Button variant="teacher" size="teacher">
                    <LogOut className='h-4 w-4 mr-2'/>
                    Exit
                </Button>
            </Link>

            ): (
                <Link href="/teacher/courses">
                    <Button variant="teacher" size="teacher" > TeacherMode</Button>
                </Link>
            )
        }
        
      <UserButton />
    </div>
    </>

  )
}

export default NavRoutes
