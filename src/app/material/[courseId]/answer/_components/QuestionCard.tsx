import { QAPair } from "@prisma/client";
import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import React from "react";

interface QuestionCardProps {
  pair: QAPair;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

function QuestionCard({ pair, isExpanded, toggleExpanded }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow">
    <div
      onClick={toggleExpanded}
      className="flex justify-between items-start p-5 cursor-pointer hover:bg-gray-50"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {pair.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-sky-700 text-xs font-medium">
              <Tag size={12} />
              {pair.category}
            </span>
          )}
          <DifficultyIndicator level={pair.difficulty} />
        </div>
        <h3 className="text-lg font-medium text-gray-800">{pair.question}</h3>
      </div>
      <div className="ml-4 p-1 text-gray-500 bg-gray-100 rounded-full">
        {isExpanded ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </div>
    </div>

    {isExpanded && (
      <div className="p-5 bg-gray-50 border-t border-gray-100">
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{pair.answer}</p>
        </div>
      </div>
    )}
  </div>
  );
}

export default QuestionCard;



const DifficultyIndicator = ({ level }: { level: number }) => (
  <div className="flex items-center gap-2 text-xs text-gray-500">
    <span>Difficulty:</span>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(dot => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot <= level ? 'bg-sky-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  </div>
);
