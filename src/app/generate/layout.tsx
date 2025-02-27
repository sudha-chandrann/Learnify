import React from 'react'
import GenerateSideBar from './_components/GenerateSideBar';
import GenerateNavBar from './_components/GenerateNavbar';

function Generatelayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh  flex">
      <div className="h-[80px] md:pl-80  fixed insert-y-0 w-full  z-50 shadow-md bg-white">
        <GenerateNavBar/>
      </div>
      <div className=" hidden md:flex flex-col fixed inset-y-0 z-50 w-80 h-full bg-white">
        <GenerateSideBar/>
      </div>
      <main className="md:pl-80 h-full pt-[80px] w-full">{children}</main>
    </div>
  )
}

export default Generatelayout
