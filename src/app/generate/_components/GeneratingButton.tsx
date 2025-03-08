'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function GeneratingButton({ courseid }: { courseid: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const GenerateChapters = async () => {
    try {
      setIsLoading(true);
       await axios.post("/api/generate/courses", { courseId: courseid });
      toast.success("Chapters generated successfully!");
      // Refresh or navigate to course details page
      router.refresh();
      router.push(`/generate/${courseid}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {  // ✅ FIXED: Defined `error` as `any`
      console.error("Error during generating chapters", error);
      toast.error(error?.response?.data?.message || "Something went wrong during generation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      disabled={isLoading}
      className="w-full py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center gap-2 transition"
      onClick={GenerateChapters}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} 
      {isLoading ? "Generating..." : "Generate"}
    </Button>
  );
}

export default GeneratingButton;
