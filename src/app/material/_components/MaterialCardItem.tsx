"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book, FileText, HelpCircle, Layers, ArrowRight, Plus, Loader2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils"; 

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
  courseId
}: MaterialCardItemProps) {
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch material generation status on component mount
  useEffect(() => {
    const checkMaterialStatus = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/generate/material", {
          courseid: courseId,
          materialType: iconType
        });
        setIsGenerated(response.data.isPresent);
      } catch (error) {
        console.error("Failed to check material status:", error);
        setIsGenerated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaterialStatus();
  }, [courseId, iconType]);

  // Material type configurations
  const materialConfig = {
    notes: {
      icon: <FileText className={`h-6 w-6 ${isGenerated ? "text-sky-600" : "text-gray-400"}`} />,
      border: isGenerated ? "border-sky-100" : "border-gray-200",
      buttonBg: isGenerated ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-100 hover:bg-gray-200",
      buttonText: isGenerated ? "text-white" : "text-gray-700"
    },
    flashcard: {
      icon: <Layers className={`h-6 w-6 ${isGenerated ? "text-purple-600" : "text-gray-400"}`} />,
      border: isGenerated ? "border-purple-100" : "border-gray-200",
      buttonBg: isGenerated ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-100 hover:bg-gray-200",
      buttonText: isGenerated ? "text-white" : "text-gray-700"
    },
    quiz: {
      icon: <Book className={`h-6 w-6 ${isGenerated ? "text-emerald-600" : "text-gray-400"}`} />,
      border: isGenerated ? "border-emerald-100" : "border-gray-200",
      buttonBg: isGenerated ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-100 hover:bg-gray-200",
      buttonText: isGenerated ? "text-white" : "text-gray-700"
    },
    question: {
      icon: <HelpCircle className={`h-6 w-6 ${isGenerated ? "text-amber-600" : "text-gray-400"}`} />,
      border: isGenerated ? "border-amber-100" : "border-gray-200",
      buttonBg: isGenerated ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-100 hover:bg-gray-200",
      buttonText: isGenerated ? "text-white" : "text-gray-700"
    }
  };
  
  // Get current material configuration or default to notes
  const config = materialConfig[iconType as keyof typeof materialConfig] || materialConfig.notes;
  
  // Handle material generation
  const handleGenerateMaterial = async () => {
    console.log(`Generating ${iconType} material for course ${courseId}`);
  };

  return (
    <div 
      className={cn(
        "rounded-lg border p-4 transition-all duration-300 h-full flex flex-col",
        isGenerated ? config.border : "border-gray-200",
        "shadow-sm hover:shadow"
      )}
  >
      <div className="mb-3">{config.icon}</div>
      
      <h3 className={cn(
        "font-semibold mb-1 transition-colors duration-300",
        isGenerated ? "text-gray-800" : "text-gray-700"
      )}>
        {name}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      
      <div className="mt-auto">
        {isLoading ? (
          <button 
            disabled
            className="w-full bg-gray-200 text-gray-500 py-2 px-3 rounded flex items-center justify-center text-sm"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </button>
        ) : isGenerated ? (
          <Link href={path} className="no-underline w-full">
            <button 
              className={cn(
                "w-full py-2 px-3 rounded flex items-center justify-center text-sm transition-colors",
                config.buttonBg
              )}
            >
              View Material
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        ) : (
          <button 
            onClick={handleGenerateMaterial}
            className={cn(
              "w-full py-2 px-3 rounded flex items-center justify-center text-sm transition-colors",
              config.buttonBg
            )}
          >
            Generate Material
            <Plus className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default MaterialCardItem;