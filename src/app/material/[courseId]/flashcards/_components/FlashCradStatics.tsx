import React from 'react';

interface FlashcardStatisticsProps {
  studiedCards: number;
  totalCards: number;
  correctCards: number;
}

const FlashcardStatistics = ({ studiedCards, totalCards, correctCards }: FlashcardStatisticsProps) => {
  return (
    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-2 text-sm sm:text-base">Study Progress</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs sm:text-sm">Studied: {studiedCards}/{totalCards}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs sm:text-sm">Correct: {correctCards}/{studiedCards || 1}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs sm:text-sm">Incorrect: {studiedCards - correctCards}/{studiedCards || 1}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-xs sm:text-sm">Remaining: {totalCards - studiedCards}/{totalCards}</span>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStatistics;