import Image from 'next/image';
import React, { useState } from 'react';

interface SelectOptionProps {
  studyOption: (value: string) => void;
}

interface Option {
  name: string;
  icon: string;
  description: string;
}

const SelectOption: React.FC<SelectOptionProps> = ({ studyOption }) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>();

  const options: Option[] = [
    {
      name: "Exam",
      icon: "/exam.png",
      description: "Prepare for upcoming tests and exams"
    },
    {
      name: "Job Interview",
      icon: "/interview.png",
      description: "Get ready for technical and behavioral interviews"
    },
    {
      name: "Practice",
      icon: "/practice.png",
      description: "Regular practice to strengthen your knowledge"
    },
    {
      name: "Coding Prep",
      icon: "/code.png",
      description: "Sharpen your programming and problem-solving skills"
    },
    {
      name: "Other",
      icon: "/other.png",
      description: "Custom study material for other purposes"
    },
  ];

  const handleSelect = (optionName: string): void => {
    setSelectedOption(optionName);
    studyOption(optionName);
  };

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-6">
        For which purpose do you want to create your personal study material?
      </h2>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 pb-4">
        {options.map((option, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md 
              ${selectedOption === option.name 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => handleSelect(option.name)}
            role="button"
            aria-pressed={selectedOption === option.name}
            tabIndex={0}
          >
            <div className="relative h-16 w-16 mb-3">
              <Image 
                src={option.icon} 
                alt={option.name}
                width={64}
                height={64}
              />
            </div>
            <span className="font-medium text-center">{option.name}</span>
          </div>
        ))}
      </div>

      {selectedOption && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>{options.find(option => option.name === selectedOption)?.description}</p>
        </div>
      )}
    </div>
  );
};

export default SelectOption;