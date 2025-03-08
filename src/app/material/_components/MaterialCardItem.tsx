"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  FileQuestion,
  CreditCard,
} from "lucide-react";
import { db } from "@/lib/db";

interface MaterialCardItemProps {
  name: string;
  desc: string;
  iconType: string;
  path: string;
  courseId: string;
}

function MaterialCardItem({
  name,
  desc,
  iconType,
  path,
  courseId,
}: MaterialCardItemProps) {
  const router = useRouter();
  const [hasMaterial, setHasMaterial] = useState<boolean | null>(null);

  // Render the icon based on the iconType string
  const renderIcon = () => {
    switch (iconType) {
      case "notes":
        return <BookOpen size={36} className="text-sky-600" />;
      case "flashcard":
        return <CreditCard size={36} className="text-sky-600" />;
      case "quiz":
        return <ClipboardCheck size={36} className="text-sky-600" />;
      case "question":
        return <FileQuestion size={36} className="text-sky-600" />;
      default:
        return <BookOpen size={36} className="text-sky-600" />;
    }
  };

  useEffect(() => {
    // Check if material exists
    const checkMaterial = async () => {
      try {
        // You can't directly import the db in a client component
        // We need to call an API endpoint or use React Query/SWR instead
        const response =  await db.studyChapter.findMany({
            where: {
              CourseId: courseId,
            },
          });
        
        setHasMaterial(!!response);
      } catch (error) {
        console.error("Error checking material:", error);
        setHasMaterial(false);
      }
    };

    checkMaterial();
  }, [courseId, iconType]);

  return (
    <div className="w-full h-52 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center p-4 bg-white">
      {renderIcon()}
      <h3 className="font-semibold text-lg text-center">{name}</h3>
      <p className="text-gray-600 text-sm text-center mt-2">{desc}</p>
      {hasMaterial !== null && (
        hasMaterial ? (
          <Button
            className="bg-sky-500 hover:bg-sky-700 rounded-lg px-3 py-2 mt-3"
            onClick={() => router.push(path)}
          >
            View
          </Button>
        ) : (
          <Button
            className="bg-gray-400 rounded-lg px-3 py-2 mt-3 cursor-not-allowed"
            disabled
          >
            Not Available
          </Button>
        )
      )}
    </div>
  );
}

export default MaterialCardItem;