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
    include: {
      questions: {
        orderBy: {
          orderIndex: "asc",
        }
      }
    }
  });

  if (!quiz) {
    return  redirect(`/material/${courseId}`)
  }
  const maxScore = quiz.questions.reduce((total, question) => total + question.points, 0);


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
    </div>
  );
}

export default Page;