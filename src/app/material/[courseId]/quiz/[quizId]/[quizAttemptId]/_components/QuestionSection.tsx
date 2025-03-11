/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface QuestionSectionProps {
  question: QuizQuestion;
  attemptId: string;
  questionsLength: number;
  isCompleted: boolean;
  onAnswerUpdated: () => void;
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

function QuestionSection({
  question,
  attemptId,
  questionsLength,
  isCompleted,
  onAnswerUpdated
}: QuestionSectionProps) {
  if (!question) return null;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isfetching,setisfetching]=useState<boolean>(false);
  // Fetch existing response when component mounts or question changes
  useEffect(() => {
    const fetchExistingResponse = async () => {
      try {
        setisfetching(true);
        // Replace the direct db call with an API endpoint call
        const response = await axios.get(
          `/api/quiz-response/${attemptId}/${question.id}`
        );
        
        if (response.data && response.data.userAnswer) {
          setSelectedOption(response.data.userAnswer);
        } else {
          setSelectedOption(null);
        }
      } catch (error) {
        console.error("Failed to fetch existing response:", error);
        setSelectedOption(null);
      } finally {
        setisfetching(false);
      }
    };

    fetchExistingResponse();
  }, [attemptId, question.id]);

  const handleAnswerChange = async (answer: string) => {
    if (isLoading || isCompleted) return;

    setSelectedOption(answer);
    setIsLoading(true);

    try {
      await axios.post(
        `/api/generate/quiz/${question.quizId}/${attemptId}/${question.id}`,
        {
          answer: answer,
        }
      );
      toast.success("Answer submitted successfully");
      onAnswerUpdated();
    } catch (error) {
      console.error("Failed to save answer:", error);
      toast.error("Failed to save answer. Please try again.");
    } finally {
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
          {Array.isArray(question.options) ? (
            question.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleAnswerChange(option)}
                  className="mr-3"
                  disabled={isCompleted || isLoading|| isfetching}
                />
                <label
                  htmlFor={`option-${question.id}-${index}`}
                  className={`text-gray-800 ${
                    isCompleted || isLoading
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {option}
                </label>
              </div>
            ))
          ) : (
            <p className="text-red-500">No options available</p>
          )}
        </div>
      )}

      {question.questionType === "TrueFalse" && (
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id={`true-option-${question.id}`}
              name={`question-${question.id}`}
              value="True"
              checked={selectedOption === "True"}
              onChange={() => handleAnswerChange("True")}
              className="mr-3"
              disabled={isCompleted || isLoading|| isfetching}
            />
            <label
              htmlFor={`true-option-${question.id}`}
              className={`text-gray-800 ${
                isCompleted || isLoading
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              True
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id={`false-option-${question.id}`}
              name={`question-${question.id}`}
              value="False"
              checked={selectedOption === "False"}
              onChange={() => handleAnswerChange("False")}
              className="mr-3"
              disabled={isCompleted || isLoading|| isfetching}
            />
            <label
              htmlFor={`false-option-${question.id}`}
              className={`text-gray-800 ${
                isCompleted || isLoading
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              False
            </label>
          </div>
        </div>
      )}

      {question.questionType === "FillInBlank" && (
        <div>
          <input
            type="text"
            value={selectedOption || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your answer"
            disabled={isCompleted || isLoading|| isfetching}
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