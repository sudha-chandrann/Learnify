"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import toast from "react-hot-toast";
import { useConfettiStore } from "../../../../../../../hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted: boolean;
}

function CourseProgressButton({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setisLoading] = useState(false);

  const Icon = isCompleted ? XCircle : CheckCircle;

  const onclick = async () => {
    try {
      setisLoading(true);
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted,
      });
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setisLoading(false);
    }
  };


  return (
    <div>
      <Button
        type="button"
        onClick={onclick}
        variant={isCompleted ? "outline" : "success"}
        className="w-full md:w-auto"
        disabled={isLoading}
      >
        {isCompleted ? "Not Completed" : "Mark as complete"}
        <Icon className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

export default CourseProgressButton;
