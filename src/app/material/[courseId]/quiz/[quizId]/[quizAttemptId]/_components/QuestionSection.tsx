/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { db } from '@/lib/db';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface QuestionSectionProps {
  question: QuizQuestion;
  attemptId: string;
  questionsLength: number;
  isCompleted: boolean;
}

interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
  correctAnswer: string;
  explanation: string | null;
  points: number;
  orderIndex: number;
}

function QuestionSection({ question, attemptId, questionsLength, isCompleted }: QuestionSectionProps) {
  if (!question) return null;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing response when component mounts
  useEffect(() => {
    const fetchExistingResponse = async () => {
      try {
        const response = await db.quizResponse.findUnique({
            where: {
                attemptId_questionId: {
                    attemptId,
                    questionId: question.id,
                }
            }
        });
        if (response?.userAnswer) {
          setSelectedOption(response.userAnswer);
        }
      } catch (error) {
        console.error("Failed to fetch existing response:", error);
      }
    };

    fetchExistingResponse();
  }, [attemptId, question.id]);

  const handleAnswerChange = async (answer: string) => {
    setSelectedOption(answer);
    setIsLoading(true);
    
    try {
      await axios.post(`/api/generate/quiz/${question.quizId}/${attemptId}/${question.id}`, {
        answer: answer
      });
      toast.success(" the answer is submitted successfully")

    } catch (error) {
      console.error("Failed to save answer:", error);
    }
    finally{
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        Question {question.orderIndex + 1} of {questionsLength}
      </h3>
      <p className="text-lg mb-6">{question.questionText}</p>
      
      {question.questionType === "MultipleChoice" && (
        <div className="space-y-3">
          {Array.isArray(question.options) 
            ? question.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${question.id}`}
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleAnswerChange(option)}
                    className="mr-3"
                    disabled={isCompleted || isLoading}
                  />
                  <label htmlFor={`option-${index}`} className="text-gray-800">{option}</label>
                </div>
              ))
            : null}
        </div>
      )}
      
      {question.questionType === "TrueFalse" && (
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="true-option"
              name={`question-${question.id}`}
              value="True"
              checked={selectedOption === "True"}
              onChange={() => handleAnswerChange("True")}
              className="mr-3"
              disabled={isCompleted || isLoading}
            />
            <label htmlFor="true-option" className="text-gray-800">True</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="false-option"
              name={`question-${question.id}`}
              value="False"
              checked={selectedOption === "False"}
              onChange={() => handleAnswerChange("False")}
              className="mr-3"
              disabled={isCompleted || isLoading}
            />
            <label htmlFor="false-option" className="text-gray-800">False</label>
          </div>
        </div>
      )}
      
      {question.questionType === "FillInBlank" && (
        <div>
          <input
            type="text"
            value={selectedOption || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your answer"
            disabled={isCompleted || isLoading}
          />
        </div>
      )}
      
      {isLoading && (
        <div className="mt-2 text-blue-500">Saving your answer...</div>
      )}
    </div>
  );
}

export default QuestionSection;