import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import QuizInterface from './_components/QuizInterface';

interface PageParams {
  params: {
    courseId: string;
    quizId: string;
    quizAttemptId: string;
  }
}

async function Page({ params }: PageParams) {
  const { quizAttemptId, courseId, quizId } = params;
  
  const quizAttempt = await db.quizAttempt.findUnique({
    where: { id: quizAttemptId },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy:{
                orderIndex: 'asc',
            }
          }
        }
      }
    }
  });
  
  if (!quizAttempt) {
    return redirect(`/material/${courseId}/quiz/${quizId}`);
  }
  if(quizAttempt.completed){
    return redirect(`/material/${courseId}/quiz/${quizId}/${quizAttemptId}/results`)
  }


  return (
    <div className="py-8">
        <QuizInterface quizAttempt={quizAttempt}  materialId={courseId} />
    </div>
  );
}

export default Page;