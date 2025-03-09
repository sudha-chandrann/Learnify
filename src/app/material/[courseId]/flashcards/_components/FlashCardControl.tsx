import React from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Flashcard } from '@prisma/client';

interface FlashcardControlsProps {
  currentIndex: number;
  filteredCards: Flashcard[];
  handlePrevious: () => void;
  handleNext: () => void;
  markCard: (status: 'correct' | 'incorrect') => void;
}

const FlashcardControls = ({ 
  currentIndex, 
  filteredCards, 
  handlePrevious, 
  handleNext, 
  markCard 
}: FlashcardControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 sm:mb-6">
      <button 
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className={`flex items-center px-3 py-1.5 rounded-md w-full sm:w-auto justify-center ${
          currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft size={18} className="mr-1" />
        Previous
      </button>
      
      <div className="flex space-x-2 w-full sm:w-auto">
        <button 
          onClick={() => markCard('incorrect')}
          className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex-1 sm:flex-initial justify-center"
        >
          <X size={16} className="mr-1" />
          Incorrect
        </button>
        
        <button 
          onClick={() => markCard('correct')}
          className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex-1 sm:flex-initial justify-center"
        >
          <Check size={16} className="mr-1" />
          Correct
        </button>
      </div>
      
      <button 
        onClick={handleNext}
        disabled={currentIndex === filteredCards.length - 1}
        className={`flex items-center px-3 py-1.5 rounded-md w-full sm:w-auto justify-center ${
          currentIndex === filteredCards.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Next
        <ChevronRight size={18} className="ml-1" />
      </button>
    </div>
  );
};

export default FlashcardControls;