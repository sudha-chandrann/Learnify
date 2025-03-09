import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    courseId: string;
  };
}

async function NotesPage({ params }: PageProps) {
  const { courseId } = params;

  // Fetch chapter notes for the course
  const chapterNote = await db.studyChapter.findFirst({
    where: {
      CourseId: courseId,
    },
    orderBy: {
      orderIndex: 'asc',
    },
  });
  if (!chapterNote) {
    return  redirect(`/material/${courseId}`)
  }

    return  redirect(`/material/${courseId}/notes/${chapterNote.id}`)
  

}

export default NotesPage;