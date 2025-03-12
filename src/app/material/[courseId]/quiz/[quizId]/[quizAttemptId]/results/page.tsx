'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Award, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface statsProps {
  totalQuestions:number;
  answeredQuestions:number;
  unansweredQuestions:number;
  correctAnswers:number;
  wrongAnswers:number;
  pointsEarned:number;
  maxPossiblePoints:number;
  percentageScore: number;
  passed:boolean,
  completed: boolean;
}

const QuizAttemptResults = ({params}:{params:{quizAttemptId:string,courseId:string}}) => {
  const { quizAttemptId,courseId } = params;
  const [stats, setStats] = useState<statsProps| null>(null);
  const [loading, setLoading] = useState(true);
  const [iserror,setiserror]=useState(false);
  const router=useRouter();
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.patch(`/api/quiz-stats/${quizAttemptId}`);
        setStats(response.data.statistics);
      } catch (err) {
        console.error(err);
        setiserror(true)
      } finally {
        setLoading(false);
      }
    };

    if (quizAttemptId) {
      fetchResults();
    }
  }, [quizAttemptId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Loading quiz results...</div>
      </div>
    );
  }

  if ( iserror||!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle size={24} />
          <span>{'Something went wrong'}</span>
        </div>
      </div>
    );
  }

  // Calculate donut chart percentage for visualization
  const scorePercentage = stats.percentageScore;
  const circumference = 2 * Math.PI * 45; // 45 is the radius of our circle
  const dashOffset = circumference - (circumference * scorePercentage) / 100;

  // Determine color based on pass/fail
  const scoreColor = stats.passed ? 'text-green-600' : 'text-red-500';
  const backbutton=()=>{
    router.push(`/material/${courseId}`)
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">Quiz Results</h1>
        </div>

        <div className="p-8">
          {/* Score overview */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="10"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={stats.passed ? "#10b981" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${scoreColor}`}>
                    {stats.percentageScore}%
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Overall Score</h2>
                <p className="text-gray-600">
                  {stats.pointsEarned} / {stats.maxPossiblePoints} points
                </p>
                <div className={`flex items-center mt-1 ${scoreColor} font-medium`}>
                  {stats.passed ? (
                    <>
                      <Award className="mr-1" size={20} />
                      <span>Passed!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1" size={20} />
                      <span>Failed</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sky-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-sky-100 p-2 rounded-full">
                    <CheckCircle className="text-sky-500" size={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-500">Correct</h3>
                    <p className="text-xl font-bold">{stats.correctAnswers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <XCircle className="text-red-500" size={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-500">Wrong</h3>
                    <p className="text-xl font-bold">{stats.wrongAnswers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Clock className="text-gray-500" size={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-500">Unanswered</h3>
                    <p className="text-xl font-bold">{stats.unansweredQuestions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <div className="text-purple-500 font-bold text-center text-sm leading-none">Q</div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-500">Total</h3>
                    <p className="text-xl font-bold">{stats.totalQuestions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Questions Answered</span>
                  <div className="flex items-end mt-2">
                    <span className="text-2xl font-bold">{stats.answeredQuestions}</span>
                    <span className="text-gray-500 ml-1 text-sm">/ {stats.totalQuestions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: `${(stats.answeredQuestions / stats.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Accuracy Rate</span>
                  <div className="flex items-end mt-2">
                    <span className="text-2xl font-bold">
                      {stats.answeredQuestions > 0
                        ? Math.round((stats.correctAnswers / stats.answeredQuestions) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.answeredQuestions > 0
                            ? (stats.correctAnswers / stats.answeredQuestions) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Points Distribution</span>
                  <div className="flex items-end mt-2">
                    <span className="text-2xl font-bold">{stats.pointsEarned}</span>
                    <span className="text-gray-500 ml-1 text-sm">/ {stats.maxPossiblePoints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`${stats.passed ? 'bg-green-500' : 'bg-orange-500'} h-2 rounded-full`}
                      style={{ width: `${(stats.pointsEarned / stats.maxPossiblePoints) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {!stats.completed && (
                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="flex items-center">
                    <AlertCircle className="text-yellow-500 mr-2" size={20} />
                    <p className="text-sm text-yellow-700">
                      This quiz is not yet completed. You can resume where you left off.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-center md:justify-end space-x-4">
            
              <button className="px-6 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors">
                View Detailed Report
              </button>
            
            <button className="px-6 py-2 bg-slate-200 text-gray-800 font-medium rounded-lg hover:bg-slate-300 transition-colors"
            onClick={backbutton}
             >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptResults;