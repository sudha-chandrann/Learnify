"use client";

import { QACollection, QAPair } from "@prisma/client";
import { useState, useMemo } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import QuestionCard from "./QuestionCard";
import CategoryFilter from "./CategoryFilter";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

interface QACollectionDisplayProps {
  qacollection: QACollection;
  qapairs: QAPair[];
}

function QACollectionDisplay({
  qacollection,
  qapairs,
}: QACollectionDisplayProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    qapairs.forEach((pair) => {
      if (pair.category) {
        categorySet.add(pair.category);
      }
    });
    return Array.from(categorySet);
  }, [qapairs]);

  // Toggle question expansion
  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter QA pairs by category and search query
  const filteredPairs = useMemo(() => {
    return qapairs.filter((pair) => {
      const matchesCategory =
        !selectedCategory || pair.category === selectedCategory;
      return matchesCategory;
    });
  }, [qapairs, selectedCategory]);

  // Group questions by category for a better organization
  const groupedPairs = useMemo(() => {
    const groups: Record<string, QAPair[]> = {};

    filteredPairs.forEach((pair) => {
      const category = pair.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(pair);
    });

    return groups;
  }, [filteredPairs]);

  return (
    <div className="space-y-6 lg:mx-[10%] md:mx-[5%] mx-[3%]">
      <div className="flex items-center justify-between">
      <Link
          href={`/material/${qacollection.studyMaterialId}`}
          className="flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6 "
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Study Materials
        </Link>
        <DeleteButton courseId={qacollection.studyMaterialId}/>
      </div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <BookOpen size={24} className="text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {qacollection.title}
            </h1>
            <p className="text-gray-600 mt-1">{qacollection.description}</p>
          </div>
        </div>
      </div>

      {/* Controls section */}
      <div className="w-full">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-2">
            <p className="text-gray-500 text-sm">Total Questions</p>
            <p className="text-2xl font-bold text-gray-800">{qapairs.length}</p>
          </div>
          <div className="text-center p-2">
            <p className="text-gray-500 text-sm">Categories</p>
            <p className="text-2xl font-bold text-gray-800">
              {categories.length}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-gray-500 text-sm">Filtered Questions</p>
            <p className="text-2xl font-bold text-gray-800">
              {filteredPairs.length}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-gray-500 text-sm">Avg. Difficulty</p>
            <p className="text-2xl font-bold text-gray-800">
              {Math.round(
                qapairs.reduce((sum, pair) => sum + pair.difficulty, 0) /
                  (qapairs.length || 1)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Questions by category */}
      {Object.keys(groupedPairs).length > 0 ? (
        Object.entries(groupedPairs).map(([category, pairs]) => (
          <div key={category} className="space-y-3">
            <h2 className="text-xl font-bold text-gray-700 px-1">{category}</h2>
            <div className="space-y-3">
              {pairs.map((pair) => (
                <QuestionCard
                  key={pair.id}
                  pair={pair}
                  isExpanded={!!expandedQuestions[pair.id]}
                  toggleExpanded={() => toggleQuestion(pair.id)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-600">
            No questions match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default QACollectionDisplay;
