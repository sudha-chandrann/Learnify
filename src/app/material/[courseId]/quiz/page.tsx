import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function Page({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const quiz = await db.quiz.findUnique({
    where: {
      studyMaterialId: courseId,
    },
  });

  if (!quiz) {
    return  redirect(`/material/${courseId}`)
  }

  return redirect(`/material/${courseId}/quiz/${quiz.id}`)
}

export default Page;