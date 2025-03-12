import { formatDate } from '@/lib/format';
import { StudyMaterial } from '@prisma/client';
import { BarChart, BookOpen, Clock, Code, CheckCircle, Award } from 'lucide-react';
import React from 'react';

interface CourseIntroProps {
  studyMaterial: StudyMaterial;
  chaptersCount: number; // Renamed for clarity
}


export default function CourseIntro({ studyMaterial, chaptersCount }: CourseIntroProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialLayout = studyMaterial?.materialLayout as Record<string, any> | null;
  const courseName = materialLayout?.course_name || studyMaterial?.topic || 'Untitled Course';
  const courseSummary = materialLayout?.course_summary || 'No course description available.';
  
  const completedChapters = 0;
  const progressPercentage = chaptersCount > 0 ? (completedChapters / chaptersCount) * 100 : 0;

  //  Returns appropriate text color based on difficulty level
  const getDifficultyColor = (): string => {
    const difficultyLevel = studyMaterial?.difficultyLevel?.toLowerCase() || '';
    
    const colorMap: Record<string, string> = {
      'easy': 'text-green-600',
      'medium': 'text-amber-600',
      'hard': 'text-red-600'
    };
    
    return colorMap[difficultyLevel] || 'text-blue-600';
  };

  return (
    <section className="bg-sky-100 rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
      <div className="p-6 md:p-8">
        {/* Topic badge */}
        <div className="mb-4">
          <span className="px-3 py-1 bg-white text-sky-600 rounded-full text-sm font-medium shadow-sm inline-flex items-center">
            <Code className="w-3.5 h-3.5 mr-1.5" />
            {studyMaterial?.topic}
          </span>
        </div>

        {/* Course title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{courseName}</h1>
        
        {/* Course metadata statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <MetadataCard 
            label="Difficulty" 
            value={studyMaterial?.difficultyLevel || 'N/A'} 
            icon={<BarChart className={`w-4 h-4 mr-1.5 ${getDifficultyColor()}`} />} 
          />
          
          <MetadataCard 
            label="Type" 
            value={studyMaterial?.materialType || 'N/A'} 
            icon={<Award className="w-4 h-4 mr-1.5 text-sky-800" />} 
          />
          
          <MetadataCard 
            label="Chapters" 
            value={chaptersCount.toString()} 
            icon={<BookOpen className="w-4 h-4 mr-1.5 text-sky-600" />} 
          />
          
          <MetadataCard 
            label="Created" 
            value={formatDate(studyMaterial?.createdAt) || 'N/A'} 
            icon={<Clock className="w-4 h-4 mr-1.5 text-green-600" />} 
          />
        </div>
        
        {/* Course summary with decorative element */}
        <div className="mt-8 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-sky-500 rounded-full"></div>
          <div className="pl-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">About this Course</h2>
            <p className="text-gray-700 leading-relaxed">{courseSummary}</p>
          </div>
        </div>
        
      </div>
    </section>
  );
}


interface MetadataCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function MetadataCard({ label, value, icon }: MetadataCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex items-center mt-1">
        {icon}
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}