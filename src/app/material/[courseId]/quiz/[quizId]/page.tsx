import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuizInterface from '../_components/QuizInterface';
import QuizAttemptCard from '../_components/QuizAttemptCard';

async function Page({ params }: { params: { courseId: string, quizId: string } }) {
  const { courseId, quizId } = params;
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/");
  }
  
  const quiz = await db.quiz.findUnique({
    where: {
      studyMaterialId: courseId,
    },
    include: {
      questions: {
        orderBy: {
          orderIndex: "asc",
        }
      }
    }
  });
  
  if (!quiz) {
    return redirect(`/material/${courseId}`);
  }
  
  const maxScore = quiz.questions.reduce((total, question) => total + question.points, 0);
  
  const quizAttempts = await db.quizAttempt.findMany({
    where: {
      quizId: quizId,
      userId: userId,
      completed: true
    },
    orderBy: {
      completedAt: "desc"
    }
  });
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href={`/material/${courseId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Study Materials
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="font-medium text-sm mb-1">Questions:</div>
                <div className="text-xl font-bold">{quiz.questions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-medium text-sm mb-1">TotalScore:</div>
                <div className="text-xl font-bold">{maxScore}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-medium text-sm mb-1">Time Limit:</div>
                <div className="text-xl font-bold">
                  {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No time limit"}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="font-medium text-sm mb-1">Passing Score:</div>
                <div className="text-xl font-bold">{quiz.passingScore}%</div>
              </CardContent>
            </Card>
          </div>
          
          <QuizInterface quiz={quiz} questionlenght={quiz.questions.length} />
        </CardContent>
      </Card>
      
      {quizAttempts.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Previous Attempts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {quizAttempts.map((attempt) => (
              <QuizAttemptCard 
                key={attempt.id}
                attempt={attempt}
                courseId={courseId}
                quizId={quizId}
                passingScore={quiz.passingScore}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">You haven&apos;t completed any quiz attempts yet.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Page;