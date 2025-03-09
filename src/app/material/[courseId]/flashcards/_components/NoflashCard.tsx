import React from 'react';

interface NoFlashcardsProps {
  onReset: () => void;
}

const NoFlashcards = ({ onReset }: NoFlashcardsProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-4 sm:p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">No flashcards available</h3>
      <p className="text-gray-600 text-sm sm:text-base">Try adjusting your filter or adding new flashcards to this set.</p>
      <button 
        onClick={onReset}
        className="mt-4 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default NoFlashcards;