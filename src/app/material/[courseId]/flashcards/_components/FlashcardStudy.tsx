"use client";

import React, { useState, useEffect } from 'react';
import { Flashcard, FlashcardSet } from '@prisma/client';
import NoFlashcards from './NoflashCard';
import FlashcardHeader from './FlashCardHeader';
import FlashcardCard from './FlashCardCard';
import FlashcardControls from './FlashCardControl';
import FlashcardStatistics from './FlashCradStatics';


interface FlashcardStudyProps {
  flashcardSet: FlashcardSet;
  flashcards: Flashcard[];
}

const FlashcardStudy = ({ flashcardSet, flashcards }: FlashcardStudyProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null);
  const [studyProgress, setStudyProgress] = useState<Record<string, 'correct' | 'incorrect' | null>>({});

  // Initialize shuffled cards and study progress
  useEffect(() => {
    setShuffledCards([...flashcards]);
    const initialProgress: Record<string, 'correct' | 'incorrect' | null> = {};
    flashcards.forEach(card => {
      initialProgress[card.id] = null;
    });
    setStudyProgress(initialProgress);
  }, [flashcards]);

  // Filter cards based on difficulty
  const filteredCards = filterDifficulty 
    ? (isShuffled ? shuffledCards : flashcards).filter(card => card.difficulty === filterDifficulty)
    : (isShuffled ? shuffledCards : flashcards);

  const currentCard = filteredCards[currentIndex];
  
  // Calculate study progress
  const totalCards = filteredCards.length;
  const studiedCards = Object.values(studyProgress).filter(status => status !== null).length;
  const correctCards = Object.values(studyProgress).filter(status => status === 'correct').length;
  
  // Handle flipping the card
  const handleFlip = () => {
    setFlipped(!flipped);
  };

  // Navigate to the next card
  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  // Navigate to the previous card
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  // Shuffle the cards
  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    setFlipped(false);
  };

  // Reset to original order
  const handleReset = () => {
    setIsShuffled(false);
    setCurrentIndex(0);
    setFlipped(false);
    setFilterDifficulty(null);
    
    // Reset progress
    const resetProgress: Record<string, 'correct' | 'incorrect' | null> = {};
    flashcards.forEach(card => {
      resetProgress[card.id] = null;
    });
    setStudyProgress(resetProgress);
  };

  // Mark the current card as correct or incorrect
  const markCard = (status: 'correct' | 'incorrect') => {
    if (!currentCard) return;
    
    setStudyProgress(prev => ({
      ...prev,
      [currentCard.id]: status
    }));
    
    // Automatically move to next card
    if (currentIndex < filteredCards.length - 1) {
      handleNext();
    }
  };

  if (!currentCard) {
    return <NoFlashcards onReset={handleReset} />;
  }

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto">
      <FlashcardHeader 
        flashcardSet={flashcardSet}
        currentIndex={currentIndex}
        filteredCards={filteredCards}
        studiedCards={studiedCards}
        totalCards={totalCards}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
        setCurrentIndex={setCurrentIndex}
        handleShuffle={handleShuffle}
        handleReset={handleReset}
      />
      
      <FlashcardCard 
        currentCard={currentCard}
        flipped={flipped}
        handleFlip={handleFlip}
      />
      
      <FlashcardControls 
        currentIndex={currentIndex}
        filteredCards={filteredCards}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        markCard={markCard}
      />
      
      <FlashcardStatistics 
        studiedCards={studiedCards}
        totalCards={totalCards}
        correctCards={correctCards}
      />
    </div>
  );
};

export default FlashcardStudy;