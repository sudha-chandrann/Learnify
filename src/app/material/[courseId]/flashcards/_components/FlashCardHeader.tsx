import React from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';
import { Flashcard, FlashcardSet } from '@prisma/client';

interface FlashcardHeaderProps {
  flashcardSet: FlashcardSet;
  currentIndex: number;
  filteredCards: Flashcard[];
  studiedCards: number;
  totalCards: number;
  filterDifficulty: number | null;
  setFilterDifficulty: (difficulty: number | null) => void;
  setCurrentIndex: (index: number) => void;
  handleShuffle: () => void;
  handleReset: () => void;
}

const FlashcardHeader = ({ 
  flashcardSet, 
  currentIndex, 
  filteredCards, 
  studiedCards, 
  totalCards,
  filterDifficulty,
  setFilterDifficulty,
  setCurrentIndex,
  handleShuffle,
  handleReset
}: FlashcardHeaderProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold truncate">{flashcardSet.title}</h1>
      <p className="text-gray-600 mb-2 text-sm sm:text-base">{flashcardSet.description}</p>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="text-sm font-medium">
          Card {currentIndex + 1} of {filteredCards.length} 
          <span className="ml-2 text-gray-500">
            ({Math.round((studiedCards / totalCards) * 100) || 0}% completed)
          </span>
        </div>
        
        <div className="flex space-x-2">
          <select 
            className="px-2 sm:px-3 py-1 border rounded-md text-sm bg-white"
            value={filterDifficulty?.toString() || ""}
            onChange={(e) => {
              setFilterDifficulty(e.target.value ? parseInt(e.target.value) : null);
              setCurrentIndex(0);
            }}
          >
            <option value="">All Difficulties</option>
            <option value="1">⭐ Very Easy</option>
            <option value="2">⭐⭐ Easy</option>
            <option value="3">⭐⭐⭐ Medium</option>
            <option value="4">⭐⭐⭐⭐ Hard</option>
            <option value="5">⭐⭐⭐⭐⭐ Very Hard</option>
          </select>
          
          <button 
            onClick={handleShuffle}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Shuffle cards"
          >
            <Shuffle size={20} />
          </button>
          
          <button 
            onClick={handleReset}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Reset study session"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-sky-600 h-2 rounded-full" 
          style={{ width: `${(studiedCards / totalCards) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FlashcardHeader;