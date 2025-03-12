"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizTimer from "./QuizTimer";

interface QuizStatsProps {
  attemptId: string;
  questionsCount: number;
  timeLimit: number | null; // In minutes
  startedAt: Date;
  answerUpdateKey: number;
  quizId:string;
  materialId:string
}

export default function QuizStats({
  attemptId,
  questionsCount,
  timeLimit,
  startedAt,
  answerUpdateKey,
  quizId,
  materialId
}: QuizStatsProps) {
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // Fetch the count of answered questions
  useEffect(() => {
    const fetchAnsweredCount = async () => {
      try {
        const response = await axios.get(`/api/quiz-stats/${attemptId}`);
        if (response.data && typeof response.data.answeredCount === "number") {
          setAnsweredCount(response.data.answeredCount);
        }
      } catch (error) {
        console.error("Failed to fetch answered questions count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredCount();
    
  }, [attemptId,answerUpdateKey]);





  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row sm:justify-between items-center">
      <div className="mb-2 sm:mb-0">
        <h3 className="text-md font-medium text-gray-700">Progress</h3>
        <p className="text-lg font-semibold">
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            `${answeredCount} of ${questionsCount} questions answered`
          )}
        </p>
      </div>
      <QuizTimer
          quizId={quizId}
          attemptId={attemptId}
          timeLimit={timeLimit}
          startedAt={startedAt}
          materialId={materialId}
        />
    </div>
  );
}