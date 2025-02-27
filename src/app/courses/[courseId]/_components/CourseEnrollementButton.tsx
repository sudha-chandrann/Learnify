'use client';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useConfettiStore } from '../../../../../hooks/use-confetti-store';
interface CourseEnrollButtonProps {
    courseId:string;
    price:number;
}

function CourseEnrollButton({courseId,price}:CourseEnrollButtonProps) {
  const router =useRouter();
  const [isloading,setisloading]=useState(false);
    const confetti =useConfettiStore();

   const onclick=async()=>{
      try{
        setisloading(true);
        await axios.post(`/api/courses/${courseId}/purchase`)
        toast.success(" the chapter is purchased successfully")
        confetti.onOpen()
        router.refresh();
      }
      catch(error){
        console.error(error);
        toast.error("something  is  not found")

      }
      finally{
        setisloading(false);
      }
      
   }

  return (
    <Button className="w-full h-12 mb-4 text-md bg-sky-600 hover:bg-sky-700" onClick={onclick} disabled={isloading}>
    
    Enroll Course for {formatPrice(price)}
  </Button>
  )
}

export default CourseEnrollButton
