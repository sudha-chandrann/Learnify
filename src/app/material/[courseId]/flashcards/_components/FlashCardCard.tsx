import React from 'react';
import { Star } from 'lucide-react';
import { Flashcard } from '@prisma/client';

interface FlashcardCardProps {
  currentCard: Flashcard;
  flipped: boolean;
  handleFlip: () => void;
}

const FlashcardCard = ({ currentCard, flipped, handleFlip }: FlashcardCardProps) => {
  // Format the difficulty as stars
  const renderDifficultyStars = (difficulty: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="flex justify-center w-full mb-4 sm:mb-6">
      <div 
        className="relative w-full md:w-4/5 lg:w-3/5 xl:w-1/2 aspect-[3/2] cursor-pointer rounded-xl shadow-lg transition-all duration-500"
        onClick={handleFlip}
        style={{
          perspective: "1000px"
        }}
      >
        <div 
          className="absolute w-full h-full rounded-xl transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
          }}
        >
          {/* Front of card */}
          <div className={`absolute w-full h-full rounded-xl p-3 sm:p-6 flex flex-col bg-white ${flipped ? 'invisible' : 'visible'} border-2 border-gray-200`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex">
                {renderDifficultyStars(currentCard.difficulty)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                Front
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-2">
              <div className="text-lg sm:text-xl font-medium text-center">{currentCard.front}</div>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-4">
              Click to flip
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className="absolute w-full h-full rounded-xl p-3 py-4 sm:p-6 flex flex-col bg-blue-50 border-2 border-blue-200"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex">
                {renderDifficultyStars(currentCard.difficulty)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                Back
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-2 overflow-auto">
              <div 
                className="text-lg sm:text-xl text-center" 
                dangerouslySetInnerHTML={{ 
                  __html: currentCard.back.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded">$1</code>') 
                }}
              ></div>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-4">
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCard;