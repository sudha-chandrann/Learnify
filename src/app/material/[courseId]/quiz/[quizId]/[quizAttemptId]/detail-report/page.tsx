import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import formatTimeDifference from '@/lib/format';
import QuestionSection from './_components/QuestionSection';
import ActionSection from './_components/ActionSection';

interface PageProps {
  params: {
    courseId: string;
    quizId: string;
    quizAttemptId: string;
  }
}

async function QuizResultsPage({ params }: PageProps) {
  const { quizAttemptId, courseId, quizId } = params;
  
  const quizAttempt = await db.quizAttempt.findUnique({
    where: {
      id: quizAttemptId
    },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy:{
                orderIndex:'asc'
            }
          }
        }
      },
      responses: {
        include: {
          question: true
        }
      }
    }
  });
  
  if (!quizAttempt?.completed) {
    return redirect(`/material/${courseId}/quiz/${quizId}/${quizAttemptId}`);
  }

  // Calculate percentage score
  const percentageScore = (quizAttempt.score / quizAttempt.maxScore * 100).toFixed(1);
  const isPassed = parseFloat(percentageScore) >= quizAttempt.quiz.passingScore;

  // Stats calculation
  const totalQuestions = quizAttempt.quiz.questions.length;
  const answeredQuestions = quizAttempt.responses.filter(r => r.userAnswer !== null && r.userAnswer !== '').length;
  const correctAnswers = quizAttempt.responses.filter(r => r.isCorrect).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  return (
    <div className="container mx-auto py-10 px-5 md:px-[5%console.log('QuizResultsPage params:', params);
console.log('Quiz attempt data:', quizAttempt);
console.log('Percentage score:', percentageScore);
console.log('Is passed:', isPassed);
console.log('Stats:', totalQuestions, answeredQuestions, correctAnswers, unansweredQuestions);] lg:px-[10%]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{quizAttempt.quiz.title} - Results</h1>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="px-4 py-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-xl font-semibold">
              {quizAttempt.score}/{quizAttempt.maxScore} ({percentageScore}%)
            </p>
          </div>
          <div className="px-4 py-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-xl font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {isPassed ? 'Passed' : 'Failed'}
            </p>
          </div>
          <div className="px-4 py-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Questions</p>
            <p className="text-xl font-semibold">
              {correctAnswers}/{totalQuestions} correct
            </p>
          </div>
          <div className="px-4 py-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Time Taken</p>
            <p className="text-xl font-semibold">
              {quizAttempt.completedAt && 
                formatTimeDifference(quizAttempt.startedAt, quizAttempt.completedAt)}
            </p>
          </div>
        </div>

        {unansweredQuestions > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
            <p className="text-yellow-800">
              <span className="font-medium">Note:</span> You did not attempt {unansweredQuestions} question{unansweredQuestions > 1 ? 's' : ''}.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {quizAttempt.quiz.questions
          .map((question, index) => {
            const response = quizAttempt.responses.find(r => r.questionId === question.id);
            const isCorrect = response?.isCorrect || false;
            const isNotAttempted = !response?.userAnswer;
            
            return (
              <div 
                key={question.id} 
                className={`border rounded-lg p-6 ${
                  isNotAttempted ? 'border-yellow-300 bg-yellow-50' : 
                    (isCorrect ? 'border-green-200' : 'border-red-200')
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isNotAttempted ? 
                      <AlertCircle className="h-5 w-5 text-yellow-500" /> :
                      (isCorrect ? 
                        <CheckCircle className="h-5 w-5 text-green-600" /> : 
                        <XCircle className="h-5 w-5 text-red-600" />
                      )
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">
                        Question {index + 1}: {question.questionText}
                      </h3>
                      <div className="text-sm ml-2">
                        {isNotAttempted ? 
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Not attempted</span> :
                          (isCorrect ? 
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Correct</span> : 
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Incorrect</span>
                          )
                        }
                      </div>
                    </div>
                    
                    <div className="mb-4">
                        <QuestionSection question={question} response={response}/>
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-1">Explanation:</h4>
                        <p className="text-blue-900">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      
      <ActionSection courseId={courseId} quizId={quizId}/>
    </div>
  );
}




  export default QuizResultsPage;