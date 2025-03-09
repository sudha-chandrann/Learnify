import React from 'react';

interface FlashcardProgressProps {
  studiedCards: number;
  totalCards: number;
}

const FlashcardProgress = ({ studiedCards, totalCards }: FlashcardProgressProps) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-sky-600 h-2 rounded-full" 
        style={{ width: `${(studiedCards / totalCards) * 100}%` }}
      ></div>
    </div>
  );
};

export default FlashcardProgress;