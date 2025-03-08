import React from 'react'
import NotesSideBar from './_components/NotesSideBar';
import NotesNavBar from './_components/NotesNavBar';

function Noteslayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params:{
    courseId:string
  }
}>) {
  return (
    <div className="h-dvh  flex">
      <div className="h-[80px] md:pl-80  fixed insert-y-0 w-full  z-50 shadow-md bg-white">
        <NotesNavBar courseId={params.courseId}/>
      </div>
      <div className=" hidden md:flex flex-col fixed inset-y-0 z-50 w-80 md:w-64 lg:w-80 h-full bg-white">
        <NotesSideBar courseId={params.courseId}/>
      </div>
      <main className="md:pl-64 lg:pl-80 h-full pt-[80px] w-full">{children}</main>
    </div>
  )
}

export default Noteslayout
