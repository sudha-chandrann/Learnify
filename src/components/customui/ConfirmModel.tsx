"use client";
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
import React, { ReactNode } from "react";

interface ConfirmModelProps {
    children :ReactNode;
    onConfirm:()=>void;
    isCourse:boolean;
}

function ConfirmModel({
  children,
  onConfirm,
  isCourse
}: ConfirmModelProps) {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
             {children}
        </AlertDialogTrigger>
        <AlertDialogContent >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-black/70">
            This action cannot be undone.This will permanently delete this 
            {
              isCourse ? " course" : "chapter"
            }
               
               . You will not be able to recover this data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel >
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction className=" bg-sky-700 hover:bg-sky-800 text-white" onClick={onConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ConfirmModel;
