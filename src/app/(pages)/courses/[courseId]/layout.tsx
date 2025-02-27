import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";


async function CourseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { courseId: string };
}>) {
  const { userId } = await auth();
  const { courseId } = await params;
  
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });


  if (!course) {
    return redirect("/dashboard");
  }


  return (
    <div className="h-dvh  flex">
      <div className="h-[80px] md:pl-80  fixed insert-y-0 w-full  z-50 shadow-md bg-white">
        courseSidebar
      </div>
      <div className=" hidden md:flex flex-col fixed inset-y-0 z-50 w-80 h-full bg-white">
        coursenavbar
      </div>
      <main className="md:pl-80 h-full pt-[80px] w-full">{children}</main>
    </div>
  );
}

export default CourseLayout;
