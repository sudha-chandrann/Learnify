"use client";

import { useState } from "react";
import QuestionSection from "./QuestionSection";
import axios from "axios";

// Update the type definition to match your Prisma models
interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  completed: boolean;
  startedAt: Date;
  completedAt: Date | null;
  quiz: {
    id: string;
    title: string;
    description: string | null;
    timeLimit: number | null;
    passingScore: number;
    questions: QuizQuestion[];
  };
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

interface QuizAttemptProps {
  quizAttempt: QuizAttempt;
}

export default function QuizInterface({
  quizAttempt,
}: QuizAttemptProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [question, setquestion] = useState<QuizQuestion>(
    quizAttempt.quiz.questions[currentQuestionIndex]
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const questions = quizAttempt.quiz.questions;
  const isCompleted = quizAttempt.completed;

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      const response= await axios.get(`/api/generate/quiz/${quizAttempt.quiz.id}/${quizAttempt.id}`);
      const data = response.data;
      console.log(" the data is ",data)
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
    setquestion(quizAttempt.quiz.questions[currentQuestionIndex]);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
    setquestion(quizAttempt.quiz.questions[currentQuestionIndex]);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-2">{quizAttempt.quiz.title}</h1>
      {quizAttempt.quiz.description && (
        <p className="text-gray-600 mb-6">{quizAttempt.quiz.description}</p>
      )}



      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-sky-600 h-2.5 rounded-full"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <QuestionSection
        question={question}
        questionsLength={quizAttempt.quiz.questions.length}
        attemptId={quizAttempt.id}
        isCompleted={isCompleted}
      />

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isCompleted}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0 || isCompleted
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          Previous
        </button>

        <div className="flex space-x-4">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={isCompleted}
              className={`px-4 py-2 rounded ${
                isCompleted
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-sky-500 text-white hover:bg-sky-600"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleSubmitQuiz()}
              disabled={isSubmitting || isCompleted}
              className={`px-4 py-2 rounded ${
                isSubmitting || isCompleted
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>

      {/* Question navigator */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Questions</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((question) => (
            <button
              key={question.id}
              onClick={() =>{ setCurrentQuestionIndex(question.orderIndex);  setquestion(quizAttempt.quiz.questions[currentQuestionIndex]) }}
              className={`w-10 h-10 flex items-center justify-center rounded-full 
                ${currentQuestionIndex === question.orderIndex 
                  ? 'bg-sky-500 text-white'            
                  : 'bg-gray-200 text-gray-800'
                }`}
            >
              {question.orderIndex + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
