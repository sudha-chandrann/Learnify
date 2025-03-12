'use client';

import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface QuestionNavigatorProps {
  questionId: string;
  attemptId: string;
  currentQuestionIndex: number;
  orderIndex: number;
  onclick: (orderIndex: number) => void;
  answerUpdateKey: number;
}

function QuestionNavigator({
  currentQuestionIndex,
  orderIndex,
  onclick,
  attemptId,
  questionId,
  answerUpdateKey
}: QuestionNavigatorProps) {
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
      
  useEffect(() => {
    let isMounted = true;
    
    const fetchExistingResponse = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/quiz-response/${attemptId}/${questionId}`
        );
                if (isMounted) {
          setIsAnswered(
            !!response.data && 
            !!response.data.userAnswer && 
            response.data.userAnswer.trim() !== ''
          );
        }
      } catch (error) {
        console.error("Failed to fetch existing response:", error);
        if (isMounted) setIsAnswered(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchExistingResponse();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [attemptId, questionId,answerUpdateKey]);
  
  const handleClick = () => {
    onclick(orderIndex);
  };
  
  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-300 hover:text-white ${
        currentQuestionIndex === orderIndex
          ? "bg-sky-500 text-white"
          : isAnswered
            ? "bg-green-400 text-white" 
            : "bg-gray-200 text-gray-800"
      }`}
      aria-label={`Go to question ${orderIndex + 1}${isAnswered ? ' (answered)' : ''}`}
    >
      {orderIndex + 1}
    </Button>
  );
}

export default QuestionNavigator;