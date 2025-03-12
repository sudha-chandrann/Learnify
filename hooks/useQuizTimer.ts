import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface UseQuizTimerProps {
  quizId: string;
  attemptId: string;
  timeLimit: number | null; // Time limit in minutes
  startedAt: Date;
  materialId:string;
}

export const useQuizTimer = ({ quizId, attemptId, timeLimit, startedAt,materialId }: UseQuizTimerProps) => {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate initial time remaining in seconds
  useEffect(() => {
    if (!timeLimit) {
      setTimeRemaining(null);
      return;
    }
    
    const startTime = new Date(startedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const totalSeconds = timeLimit * 60;
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    
    setTimeRemaining(remainingSeconds);
  }, [timeLimit, startedAt]);
  
  // Auto-submit when timer reaches zero
  const autoSubmitQuiz = useCallback(async () => {
    if (timeRemaining === 0 && !isLoading) {
      try {
        setIsLoading(true);
        const response = await axios.post(
            `/api/generate/quiz/${quizId}/${attemptId}`
        );
        console.log(" the data is ",response.data)
        if (response.data.success) {
          // Redirect to results page
          router.push(`/material/${materialId}/quiz/${quizId}/${attemptId}/results`);
        }
      } catch (error) {
        console.error('Failed to auto-submit quiz:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [timeRemaining, isLoading, quizId, attemptId, router,materialId]);
  
  // Timer countdown logic
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) {
      return;
    }
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);
  
  // Check for auto-submit when timer hits zero
  useEffect(() => {
    if (timeRemaining === 0) {
      autoSubmitQuiz();
    }
  }, [timeRemaining, autoSubmitQuiz]);
  
  // Format time for display (MM:SS)
  const formattedTime = timeRemaining === null 
    ? 'No time limit' 
    : `${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
  
  return {
    timeRemaining,
    formattedTime,
    isExpired: timeRemaining === 0,
    hasTimeLimit: timeRemaining !== null
  };
};