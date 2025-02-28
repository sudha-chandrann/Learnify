"use client";

import React, { useState } from 'react';
import SelectOption from './_components/SelectOption';
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';

interface UserInput {
  fieldName: string;
  fieldValue: string;
}

interface FormData {
  studyType: string;
  topic: string;
}

const Page: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isloading,setLoading]=useState(false);
  const [formData, setFormData] = useState<FormData>({
    studyType: "",
    topic: ""
  });

  const onNextClick = (): void => {
    setStep((prev) => prev + 1);
  };

  const handleUserInput = ({ fieldName, fieldValue }: UserInput): void => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  const generateStudyMaterial = async () => {
    if (!formData.topic) {
      alert(" missing data")
      return;
    }

    try {
      setLoading(true);
      
      console.log("Generating study material with data:", formData);
      
    } catch (error) {
      console.error("Error generating study material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center'>
      <h1 className='font-bold text-4xl text-sky-700 text-center mt-14 md:mt-28'>
        Start Building Your Personal Study Material
      </h1>
      <p className='text-gray-500 text-lg mt-3 text-center'>
        Fill the details in order to generate study material for you
      </p>

      <div className='mt-4 mx-2'>
        {step === 0 ? (
          <SelectOption studyOption={(value: string) => handleUserInput({ fieldName: 'studyType', fieldValue: value })} />
        ) : (
          <TopicInput onTopicChange={(value: string) => handleUserInput({ fieldName: 'topic', fieldValue: value })}  selectDifficultylevel={(value: string) => handleUserInput({ fieldName: 'Difficultylevel', fieldValue: value })}/>
        )}
      </div>

      <div className='flex items-center justify-between px-4 w-full py-10 md:w-[50%]'>
        {step !== 0 && (
          <Button 
            variant="outline" 
            onClick={() => setStep((prev) => prev - 1)}
          >
            Previous
          </Button>
        )}
        
        {step === 0 ? (
          <Button 
            variant="outline" 
            className='ml-auto' 
            onClick={onNextClick}
            disabled={isloading}
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="default" 
            className='ml-auto'
            disabled={isloading}
            onClick={generateStudyMaterial}
          >
            Generate
          </Button>
        )}
      </div>
    </div>
  );
};

export default Page;