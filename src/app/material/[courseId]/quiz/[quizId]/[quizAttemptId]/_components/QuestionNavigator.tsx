'use client';

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import React, { useEffect, useState } from "react";

interface QuestionNavigatorProps {
  questionId: string;
  attemptId: string;
  currentQuestionIndex: number;
  orderIndex: number;
  onclick: (orderIndex: number) => void;
}

function QuestionNavigator({
  currentQuestionIndex,
  orderIndex,
  onclick,
  attemptId,
  questionId
}: QuestionNavigatorProps) {
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  


  
  useEffect(() => {
    let isMounted = true;
    
    const fetchExistingResponse = async () => {
      try {
        const response = await db.quizResponse.findUnique({
          where: {
            attemptId_questionId: {
              attemptId,
              questionId,
            }
          }
        });
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Check if response exists AND has a userAnswer property that's not empty
          setIsAnswered(!!response && !!response.userAnswer && response.userAnswer.trim() !== '');
        }
      } catch (error) {
        console.error("Failed to fetch existing response:", error);
        if (isMounted) setIsAnswered(false);
      }
    };
    
    fetchExistingResponse();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [attemptId, questionId]);
  
  const handleClick = () => {
    onclick(orderIndex);
  };
  
  return (
    <Button
      type="button"
      onClick={handleClick}
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