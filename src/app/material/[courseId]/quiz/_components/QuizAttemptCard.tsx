
'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {  Calendar, Clock, Award, BarChart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { QuizAttempt } from '@prisma/client';
import formatTimeDifference, { formatDate, formatTimeFromDate } from "@/lib/format";
import { useRouter } from "next/navigation";





interface QuizAttemptCardProps {
    attempt:QuizAttempt;
    courseId:string;
    quizId:string;
    passingScore:number;
}

 export default function QuizAttemptCard({ attempt, courseId, quizId, passingScore }:QuizAttemptCardProps) {
  // Calculate percentage score
  const percentageScore = ((attempt.score / attempt.maxScore) * 100).toFixed(1);
  const isPassed = parseFloat(percentageScore) >= passingScore;
  const router=useRouter();
  
  // Calculate time taken if completed
  const timeTaken = formatTimeDifference(attempt.startedAt, attempt.completedAt||"")

  return (
    <Link href={`/material/${courseId}/quiz/${quizId}/${attempt.id}/detail-report`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-200 hover:border-blue-300">
        <CardHeader className={`py-4 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className={`h-5 w-5 ${isPassed ? 'text-green-600' : 'text-red-600'}`} />
              <CardTitle className="text-base">
                {isPassed ? 'Passed' : 'Failed'}
              </CardTitle>
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {percentageScore}%
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Score: <span className="font-medium">{attempt.score}/{attempt.maxScore}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Time: <span className="font-medium">{timeTaken}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {formatDate(attempt.startedAt)} at {formatTimeFromDate(attempt.startedAt)}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Attempt #{attempt.id.substring(0, 4)}
            </span>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2" onClick={()=>{router.push(`/material/${courseId}/quiz/${quizId}/${attempt.id}/detail-report`)}}>
              View Details
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

