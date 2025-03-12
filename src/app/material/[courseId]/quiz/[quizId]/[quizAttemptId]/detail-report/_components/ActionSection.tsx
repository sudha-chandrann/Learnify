'use client';
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'

function ActionSection({courseId,quizId}:{quizId:string,courseId:string}) {
    const router=useRouter();
  return (
    <div className="mt-8 flex justify-between">
    <Button
    onClick={()=>{router.push(`/material/${courseId}/quiz/${quizId}`)}}
      className="px-4 py-2 bg-slate-500 rounded-md hover:bg-slate-600 transition"
    >
      Return to Quiz
    </Button>
    <Button 
     onClick={()=>{router.push(`/material/${courseId}`)}}
      className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
    >
      Back to Course Material
    </Button>
  </div>
  )
}

export default ActionSection
