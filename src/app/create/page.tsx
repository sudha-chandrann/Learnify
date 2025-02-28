"use client";
import React, { useState } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";
import axios from "axios";


interface FormData {
  studyType: string;
  topic: string;
  difficultyLevel: string;
}

const Page: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studyType: "",
    topic: "",
    difficultyLevel: "", // 🔹 Ensure difficulty level is included
  });
 
  const onNextClick = (): void => {
    setStep((prev) => prev + 1);
  };

  const handleUserInput = (fieldName: keyof FormData, fieldValue: string): void => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const generateStudyMaterial = async () => {
    if (!formData.topic || !formData.studyType || !formData.difficultyLevel) {
      alert("Please fill in all fields before generating study material.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/generate", formData);

      console.log("Study Material Generated:", response.data);
    } catch (error) {
      console.error("Error generating study material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="font-bold text-4xl text-sky-700 text-center mt-14 md:mt-28">
        Start Building Your Personal Study Material
      </h1>
      <p className="text-gray-500 text-lg mt-3 text-center">
        Fill in the details to generate study material for you.
      </p>

      <div className="mt-4 mx-2">
        {step === 0 ? (
          <SelectOption 
            studyOption={(value: string) => handleUserInput("studyType", value)} 
          />
        ) : (
          <TopicInput 
            onTopicChange={(value: string) => handleUserInput("topic", value)}
            selectDifficultylevel={(value: string) => handleUserInput("difficultyLevel", value)}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-4 w-full py-10 md:w-[50%]">
        {step !== 0 && (
          <Button variant="outline" onClick={() => setStep((prev) => prev - 1)}>
            Previous
          </Button>
        )}

        {step === 0 ? (
          <Button variant="outline" className="ml-auto" onClick={onNextClick} disabled={isLoading}>
            Next
          </Button>
        ) : (
          <Button variant="default" className="ml-auto" disabled={isLoading} onClick={generateStudyMaterial}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Page;
