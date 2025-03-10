'use client';

import { Button } from "@/components/ui/button";
import { Quiz } from '@prisma/client';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


interface QuizInterfaceProps {
  quiz: Quiz;
  questionlenght:number
}

export default function QuizInterface({ quiz,questionlenght }: QuizInterfaceProps) {


   const [isloading,setislloading]=useState(false);
   const router= useRouter();


  //  create attempt
  const startQuiz = async () => {
    try {
      setislloading(true)
      const response = await axios.get(`/api/generate/quiz/${quiz.id}`);
      const data = response.data;
      toast.success(" the quiz attempt is created successfully")
      router.push(`/material/${quiz.studyMaterialId}/quiz/${quiz.id}/${data.id}`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error(" something went wrong during creating quiz Attempt")
    }
    finally{
      setislloading(false)
    }
  };

  
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-center mb-6">
          You are about to start the quiz.
          {quiz.timeLimit
            ? ` You will have ${quiz.timeLimit} minutes to complete all ${questionlenght} questions.`
            : ` There is no time limit for this quiz. Take your time to answer all ${questionlenght} questions.`}
        </p>
        <Button 
          size="lg" 
          onClick={startQuiz}
          className="px-8"
          disabled={isloading}
        >
          Start Quiz
        </Button>
      </div>
    );
  

}