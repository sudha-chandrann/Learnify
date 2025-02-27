import Image from 'next/image'
import React, { useState } from 'react'

function SelectOption() {
  const [selectedOption, setSelectedOption] = useState<string>();

  const options = [
    {
      name: "Exam",
      icon: "/exam.png"
    },
    {
      name: "Job Interview",
      icon: "/interview.png"
    },
    {
      name: "Practice",
      icon: "/practice.png"
    },
    {
      name: "Coding Prep",
      icon: "/code.png"
    },
    {
      name: "Other",
      icon: "/other.png"
    },
  ]

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-6">
        For which purpose do you want to create your personal study material?
      </h2>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 pb-4">
        {
          options.map((option, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md 
                ${selectedOption === option.name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => setSelectedOption(option.name)}
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
          ))
        }
      </div>


    </div>
  )
}

export default SelectOption