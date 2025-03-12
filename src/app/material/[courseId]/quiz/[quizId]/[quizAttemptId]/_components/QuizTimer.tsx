import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useQuizTimer } from '../../../../../../../../hooks/useQuizTimer';

interface QuizTimerProps {
  quizId: string;
  attemptId: string;
  timeLimit: number | null; 
  startedAt: Date; 
  materialId:string;
  
}

const QuizTimer = ({ quizId, attemptId, timeLimit, startedAt,materialId }: QuizTimerProps) => {
  const { formattedTime, isExpired, hasTimeLimit, timeRemaining } = useQuizTimer({
    quizId,
    attemptId,
    timeLimit,
    startedAt,
    materialId,
  });
  
  if (!hasTimeLimit) {
    return (
      <div className="flex items-center text-gray-500">
        <Clock size={16} className="mr-2" />
        <span>No time limit</span>
      </div>
    );
  }
  
  // Warning states
  const isWarning = timeRemaining !== null && timeRemaining < 300; // Less than 5 minutes
  const isDanger = timeRemaining !== null && timeRemaining < 60; // Less than 1 minute
  
  return (
    <div className={`flex items-center font-medium rounded-full px-3 py-1 ${
      isExpired ? 'bg-red-100 text-red-700' :
      isDanger ? 'bg-red-50 text-red-600 animate-pulse' :
      isWarning ? 'bg-yellow-50 text-yellow-700' :
      'bg-blue-50 text-blue-700'
    }`}>
      <Clock size={16} className="mr-2" />
      <span>{formattedTime}</span>
      
      {isExpired && (
        <div className="ml-2 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          <span>Time&apos;s up!</span>
        </div>
      )}
    </div>
  );
};

export default QuizTimer