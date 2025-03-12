'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  courseId: string;
}

function DeleteButton({ courseId }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/generate/material/${courseId}/flashcard`);
      toast.success("Flashcards deleted successfully");
      router.push(`/material/${courseId}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any; // Properly handle Axios errors
      toast.error(axiosError?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-black/70">
            This action cannot be undone. This will permanently delete these flashcards. You will not be able to recover this data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-sky-700 hover:bg-sky-800 text-white" 
            onClick={handleDelete} 
            disabled={isLoading}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteButton;
