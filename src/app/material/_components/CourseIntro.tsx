import { StudyMaterial } from '@prisma/client';
import { BarChart, BookOpen, Clock, Code, CheckCircle, Award } from 'lucide-react';
import React from 'react';

interface CourseIntroProps {
  studyMaterial: StudyMaterial;
  chapterlenght: number;
}

function CourseIntro({ studyMaterial, chapterlenght }: CourseIntroProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as any;
  const courseName = materialLayout?.course_name || studyMaterial?.topic;
  const courseSummary = materialLayout?.course_summary;

  // Generate a background gradient based on material type
  const getBgGradient = () => {
    switch (studyMaterial?.materialType?.toLowerCase()) {
      case 'coding prep':
        return 'from-blue-50 to-indigo-50';
      case 'Exam':
        return 'from-purple-50 to-pink-50';
      case 'Job Interview':
        return 'from-green-50 to-emerald-50';
      case 'Practice':
        return 'from-amber-50 to-orange-50';
      default:
        return 'from-gray-50 to-slate-50';
    }
  };

  // Get icon color based on difficulty level
  const getDifficultyColor = () => {
    switch (studyMaterial?.difficultyLevel?.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-amber-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  // Format the creation date nicely
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-gradient-to-br ${getBgGradient()} rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100`}>
      <div className="p-8">
        {/* Topic badge */}
        <div className="mb-3">
          <span className="px-3 py-1 bg-white text-sky-600 rounded-full text-sm font-medium shadow-sm inline-flex items-center">
            <Code className="w-3.5 h-3.5 mr-1.5" />
            {studyMaterial?.topic}
          </span>
        </div>

        {/* Course title */}
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">{courseName}</h1>
        
        {/* Course metadata/stats - redesigned as cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Difficulty</span>
            <div className="flex items-center mt-1">
              <BarChart className={`w-4 h-4 mr-1.5 ${getDifficultyColor()}`} />
              <span className="font-medium">{studyMaterial?.difficultyLevel}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Type</span>
            <div className="flex items-center mt-1">
              <Award className="w-4 h-4 mr-1.5 text-sky-800" />
              <span className="font-medium">{studyMaterial?.materialType}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Chapters</span>
            <div className="flex items-center mt-1">
              <BookOpen className="w-4 h-4 mr-1.5 text-sky-600" />
              <span className="font-medium">{chapterlenght}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Created</span>
            <div className="flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1.5 text-green-600" />
              <span className="font-medium">{formatDate(studyMaterial?.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Course summary with decorative element */}
        <div className="mt-8 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-sky-500 rounded-full"></div>
          <div className="pl-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">About this Course</h2>
            <p className="text-gray-700 leading-relaxed">{courseSummary}</p>
          </div>
        </div>
        
        {/* Course progress - enhanced */}
        <div className="mt-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-sky-600" />
                <span className="text-gray-800 font-semibold">Your Progress</span>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sky-700 font-medium">0/{chapterlenght} completed</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-sky-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: '10%' }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>Just Started</span>
              <span>In Progress</span>
              <span>Completed</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CourseIntro;