'use client';
import { QuizResponse } from '@prisma/client';
import React from 'react'
interface QuestionSectionProps {
    question: QuizQuestion;
    response:QuizResponse| undefined
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
function QuestionSection({question,response}:QuestionSectionProps) {
    const userAnswer = response?.userAnswer || '';
    const isNotAttempted = !userAnswer;
     
    switch (question.questionType) {
      case 'MultipleChoice':
        const options = question.options ? JSON.parse(JSON.stringify(question.options)) : [];
        return (
          <div className="space-y-2">
            { Array.isArray(question.options)?(
            options.map((option:string, i:number) => {
              const isUserSelection = userAnswer === option;
              const isCorrectAnswer = question.correctAnswer === option;
              
              return (
                <div 
                  key={i} 
                  className={`p-2 rounded-md flex items-center gap-2 
                    ${isCorrectAnswer ? 'border border-green-300' : ''}
                    ${isUserSelection ? (isCorrectAnswer ? 'bg-green-100' : 'bg-red-100 border border-red-300') : 
                      (isCorrectAnswer ? 'bg-green-50' : 'border border-gray-200')}
                  `}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isUserSelection ? 'bg-gray-700 border-gray-700' : 'border-gray-400'
                  }`}>
                    {isUserSelection && <div className="w-3 h-3 rounded-full bg-white"></div>}
                  </div>
                  <span className={`${isCorrectAnswer ? 'font-medium' : ''} flex-1`}>
                    {option}
                  </span>
                  <span className="text-sm">
                    {isUserSelection && (isCorrectAnswer ? 
                      <span className="text-green-600">Your choice (Correct)</span> : 
                      <span className="text-red-600">Your choice</span>
                    )}
                    {!isUserSelection && isCorrectAnswer && 
                      <span className="text-green-600">Correct answer</span>
                    }
                  </span>
                </div>
              );
            }
        )):(
            <p className="text-red-500">No options available</p>
        )}
            {isNotAttempted && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">You did not select an answer for this question.</p>
              </div>
            )}
        </div>
        );
        
      case 'TrueFalse':
        return (
          <div className="space-y-2">
            {['True', 'False'].map((option) => {
              const isUserSelection = userAnswer === option;
              const isCorrectAnswer = question.correctAnswer === option;
              
              return (
                <div 
                  key={option} 
                  className={`p-2 rounded-md flex items-center gap-2
                    ${isCorrectAnswer ? 'border border-green-300' : ''}
                    ${isUserSelection ? (isCorrectAnswer ? 'bg-green-100' : 'bg-red-100 border border-red-300') : 
                      (isCorrectAnswer ? 'bg-green-50' : 'border border-gray-200')}
                  `}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isUserSelection ? 'bg-gray-700 border-gray-700' : 'border-gray-400'
                  }`}>
                    {isUserSelection && <div className="w-3 h-3 rounded-full bg-white"></div>}
                  </div>
                  <span className={`${isCorrectAnswer ? 'font-medium' : ''} flex-1`}>
                    {option}
                  </span>
                  <span className="text-sm">
                    {isUserSelection && (isCorrectAnswer ? 
                      <span className="text-green-600">Your choice (Correct)</span> : 
                      <span className="text-red-600">Your choice</span>
                    )}
                    {!isUserSelection && isCorrectAnswer && 
                      <span className="text-green-600">Correct answer</span>
                    }
                  </span>
                </div>
              );
            })}
            {isNotAttempted && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">You did not select an answer for this question.</p>
              </div>
            )}
          </div>
        );
        
      case 'FillInBlank':
        return (
          <div className="space-y-3">
            {isNotAttempted ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">You did not provide an answer for this question.</p>
              </div>
            ) : (
              <div className={`p-3 rounded-md border ${response?.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                <p className={response?.isCorrect ? 'text-green-700 font-medium' : 'text-red-700'}>
                  {userAnswer}
                </p>
              </div>
            )}
            
            {(isNotAttempted || !response?.isCorrect) && (
              <div className="p-3 rounded-md border border-green-300 bg-green-50">
                <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
                <p className="text-green-700 font-medium">{question.correctAnswer}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="space-y-3">
            {isNotAttempted ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">You did not provide an answer for this question.</p>
              </div>
            ) : (
              <div className={`p-3 rounded-md border ${response?.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                <p className={response?.isCorrect ? 'text-green-700 font-medium' : 'text-red-700'}>
                  {userAnswer}
                </p>
              </div>
            )}
            
            {(isNotAttempted || !response?.isCorrect) && (
              <div className="p-3 rounded-md border border-green-300 bg-green-50">
                <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
                <p className="text-green-700 font-medium">{question.correctAnswer}</p>
              </div>
            )}
          </div>
        );
    }
}

export default QuestionSection
