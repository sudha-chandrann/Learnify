"use client";
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';

function page() {
   const [step,setStep]=useState(0);

   const onNextClick=()=>{
    setStep((prev)=>prev+1);
   }
   
   const onPrevClick=()=>{
    setStep((prev)=>prev-1);
   }

  return (
    <div className='w-full h-screen flex flex-col items-center  '>
       <h1 className='font-bold text-4xl text-sky-700 text-center mt-14 md:mt-28'>Start Building Your personal Study Material</h1>
       <p className='text-gray-500 text-lg mt-3 text-center'>Fill the details in order to generate study material for you</p>

       <div className='mt-4'>
        {step==0 ?  <SelectOption/> :<TopicInput/> }
    
       </div>
       <div className='flex items-center justify-between px-4 w-full py-10 md:w-[50%] '>
        <Button variant="outline" disabled={step==0} onClick={onPrevClick}>Previous</Button>
        <Button variant="outline" onClick={onNextClick}>Next</Button>
       </div>
    </div>
  )
}

export default page
