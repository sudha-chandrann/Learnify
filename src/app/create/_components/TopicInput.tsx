import React, { useState, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface TopicInputProps {
  onTopicChange?: (value: string) => void;
  selectDifficultylevel?:(value:string)=>void;
}

type DifficultyLevel = "" | "beginner" | "intermediate" | "advanced" | "expert";

const TopicInput: React.FC<TopicInputProps> = ({ onTopicChange,selectDifficultylevel }) => {
  const [topicText, setTopicText] = useState<string>("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("");

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    setTopicText(value);
    onTopicChange?.(value);
  };

  const handleDifficultyChange = (value: DifficultyLevel): void => {
    setDifficulty(value);
    selectDifficultylevel?.(value);
  };

  const difficultyDescriptions: Record<Exclude<DifficultyLevel, "">, string> = {
    beginner: "Perfect for newcomers to the subject",
    intermediate: "For those with some prior knowledge",
    advanced: "For in-depth understanding of complex topics",
    expert: "For mastery of the subject matter"
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardContent className="pt-6">
        <h2 className="text-center text-2xl font-bold mb-4">
          Enter topic or paste the content for which you want to generate study
          material
        </h2>
        
        <Textarea 
          placeholder="Start writing here..." 
          className="min-h-32 mt-2 resize-none text-base" 
          value={topicText}
          onChange={handleTextChange}
        />
        
        <div className="mt-8 mb-4">
          <h2 className="text-center text-xl font-bold mb-3">
            Select the difficulty level
          </h2>
          
          <div className="relative">
            <Select 
              value={difficulty} 
              onValueChange={(value: string) => handleDifficultyChange(value as DifficultyLevel)}
            >
              <SelectTrigger className="w-full mx-auto">
                <SelectValue placeholder="Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {difficulty && (
            <p className="mt-2 text-sm text-gray-500 text-center">
              {difficultyDescriptions[difficulty as Exclude<DifficultyLevel, "">]}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicInput;