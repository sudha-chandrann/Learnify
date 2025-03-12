"use client";
import { StudyMaterial } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, BookOpen, ArrowRight, Plus } from "lucide-react";

interface ChapterProps {
  chapter_name: string;
  chapter_summary: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topics: any;
}

interface ChapterCardProps {
  studyMaterial: StudyMaterial;
  courseId: string;
  chapter: ChapterProps;
  orderIndex: number;
}

function ChapterCard({ courseId, chapter, orderIndex }: ChapterCardProps) {
  const [isChapterPresent, setisChapterPresent] = useState(false);
  const [chapterId, setchapterId] = useState("");
  const [loading, setLoading] = useState(false);
  const chapterName = chapter.chapter_name;
  const chapterSummary = chapter.chapter_summary;
  const topics = chapter.topics || [];

  const getchapter = async () => {
    try {
      const chapter = await axios.patch(`/api/generate/courses/${courseId}`, {
        orderIndex: orderIndex,
      });
      if (chapter.data.ispresent) {
        setisChapterPresent(true);
        setchapterId(chapter.data.id);
      } else {
        setisChapterPresent(false);
      }
    } catch (error) {
      console.log("the error geting chapter", error);
    }
  };

  useEffect(() => {
    getchapter();
  });

  const generateChapter = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/generate/courses/${courseId}`, {
        orderIndex: orderIndex,
      });
      toast.success(
        response.data.message || "Chapter generated successfully"
      );
      getchapter(); // Refresh chapter status after generation
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any; // Properly handle Axios errors
      toast.error(
        axiosError?.response?.data?.error?.message || "Something went wrong during generating chapter"
      );
      console.error("the error generating chapter", error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 mb-4">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="flex items-center justify-center bg-blue-100 text-blue-600 w-8 h-8 rounded-full font-bold text-sm">
              {orderIndex + 1}
            </span>
            {chapterName}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{chapterSummary}</p>
        
        {topics.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {topics.slice(0, 3).map((topic: string, i: number) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                >
                  {topic}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                  +{topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4">
          {isChapterPresent ? (
            <button
              onClick={() => {
                router.push(`/material/${courseId}/notes/${chapterId}`);
              }}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
            >
              <BookOpen size={18} />
              <span>Go to chapter</span>
              <ArrowRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={generateChapter}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Generate chapter</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterCard;