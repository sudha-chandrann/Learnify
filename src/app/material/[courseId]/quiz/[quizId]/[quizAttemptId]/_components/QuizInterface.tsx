"use client";

import { useEffect, useState } from "react";
import QuestionSection from "./QuestionSection";
import axios from "axios";
import QuestionNavigator from "./QuestionNavigator";
import QuizStats from "./QuizStats";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  materialId: string;
}

export default function QuizInterface({
  quizAttempt,
  materialId,
}: QuizAttemptProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(
    quizAttempt.quiz.questions[currentQuestionIndex]
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [answerUpdateKey, setAnswerUpdateKey] = useState<number>(0);
  const questions = quizAttempt.quiz.questions;
  const isCompleted = quizAttempt.completed;
  const router = useRouter();

  // Function to call when an answer is updated
  const handleAnswerUpdated = () => {
    setAnswerUpdateKey((prev) => prev + 1); // Increment the key to trigger re-render
  };

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `/api/generate/quiz/${quizAttempt.quiz.id}/${quizAttempt.id}`
      );
      toast.success(" the quiz is submitted successfully");
      if (response.data.success) {
        router.push(
          `/material/${materialId}/quiz/${quizAttempt.quizId}/${quizAttempt.id}/results`
        );
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setCurrentQuestion(quizAttempt.quiz.questions[currentQuestionIndex]);
  }, [currentQuestionIndex, quizAttempt.quiz.questions]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-2">{quizAttempt.quiz.title}</h1>
      {quizAttempt.quiz.description && (
        <p className="text-gray-600 mb-6">{quizAttempt.quiz.description}</p>
      )}
      {/* Add the Quiz Stats component */}
      <QuizStats
        attemptId={quizAttempt.id}
        questionsCount={questions.length}
        timeLimit={quizAttempt.quiz.timeLimit}
        startedAt={quizAttempt.startedAt}
        answerUpdateKey={answerUpdateKey}
        quizId={quizAttempt.quiz.id}
        materialId={materialId}
      />

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-sky-600 h-2.5 rounded-full"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
          aria-label={`Progress: ${currentQuestionIndex + 1} of ${
            questions.length
          } questions`}
        ></div>
      </div>

      <QuestionSection
        question={currentQuestion}
        questionsLength={quizAttempt.quiz.questions.length}
        attemptId={quizAttempt.id}
        isCompleted={isCompleted}
        onAnswerUpdated={handleAnswerUpdated}
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
          aria-label="Previous question"
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
              aria-label="Next question"
            >
              Next
            </button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isSubmitting || isCompleted}
                  className={`px-4 py-2 rounded ${
                    isSubmitting || isCompleted
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  aria-label="Submit quiz"
                >
                  Submit
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-black">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-black/70">
                  After submission, your responses will be locked and cannot be modified or retrieved.

                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting || isCompleted}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className=" bg-sky-700 hover:bg-sky-800 text-white"
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting || isCompleted}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Question navigator */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Questions</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((question) => (
            <QuestionNavigator
              key={question.id}
              questionId={question.id}
              attemptId={quizAttempt.id}
              currentQuestionIndex={currentQuestionIndex}
              orderIndex={question.orderIndex}
              onclick={(orderIndex) => setCurrentQuestionIndex(orderIndex)}
              answerUpdateKey={answerUpdateKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
