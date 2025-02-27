import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import CoursesClient from "./_components/CourseClient";

export default async function Page() {
  const { userId } = await auth();
  
  if (!userId) {
    console.error("User not authenticated");
    return redirect("/");
  }

  const data = await db.course.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createAt: 'desc',
    },
  });

  return <CoursesClient data={data} />;
}
