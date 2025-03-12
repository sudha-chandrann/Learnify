import { db } from "@/lib/db";
import React from "react";
import QACollectionDisplay from "./_components/QACollectionDisplay";
import Link from "next/link";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

async function page({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const qacollection = await db.qACollection.findUnique({
    where: {
      studyMaterialId: courseId,
    },
  });

  if (!qacollection) {
    return redirect(`/material/${courseId}`);
  }
  const qapairs = await db.qAPair.findMany({
    where: {
      collectionId: qacollection?.id,
    },
  });
  if (qapairs.length < 1) {
    return (
      <LoadingState courseId={courseId}  />
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <QACollectionDisplay qacollection={qacollection} qapairs={qapairs} />
    </div>
  );
}

export default page;


function PageHeader({ courseId }: { courseId: string; }) {
  return (
    <div className="mb-6 p-2 sm:p-4 max-w-4xl mx-auto">
      <Link
        href={`/material/${courseId}`}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to StudyMaterial
      </Link>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-full">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Practice Questions
        </h1>
      </div>
    </div>
  );
}

// Loading state as a separate component
function LoadingState({ courseId, }: { courseId: string}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <PageHeader courseId={courseId} />
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800">
              Generating Q&A Pairs...
            </h2>
            
            <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3"></div>
            </div>
            
            <p className="text-gray-600 max-w-md">
              We&apos;re creating practice questions and answers for this course using AI. This process may take a minute or two.
            </p>
            
            <p className="text-sm text-gray-500 mt-4">
              Please check back shortly. The questions will be automatically generated based on the course content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
