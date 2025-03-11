"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

interface QuizStatsProps {
  attemptId: string;
  questionsCount: number;
  timeLimit: number | null; // In minutes
  startedAt: Date;
  answerUpdateKey: number;
}

export default function QuizStats({
  attemptId,
  questionsCount,
  timeLimit,
  startedAt,
  answerUpdateKey,
}: QuizStatsProps) {
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
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

  // Calculate and update remaining time
  useEffect(() => {
    if (!timeLimit) return; // No time limit set
    
    const calculateRemainingTime = () => {
      const startTime = new Date(startedAt).getTime();
      const currentTime = new Date().getTime();
      const elapsedMinutes = (currentTime - startTime) / (1000 * 60);
      const remainingMinutes = Math.max(0, timeLimit - elapsedMinutes);
      
      setRemainingTime(remainingMinutes);
      
      // If time is up, you might want to trigger auto-submit
      if (remainingMinutes <= 0) {
        // You could call your submit function here
        console.log("Time's up!");
      }
    };
    
    calculateRemainingTime();
    const timerId = setInterval(calculateRemainingTime, 1000); // Update every second
    
    return () => clearInterval(timerId);
  }, [timeLimit, startedAt]);

  // Format remaining time as MM:SS
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      {timeLimit && remainingTime !== null && (
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" />
          <div>
            <h3 className="text-md font-medium text-gray-700">Time Remaining</h3>
            <p className={`text-lg font-semibold ${
              remainingTime < 5 ? "text-red-500" : remainingTime < 10 ? "text-orange-500" : "text-gray-800"
            }`}>
              {formatTime(remainingTime)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}