"use client";
import GuestRoutes from '@/app/(pages)/_components/GuestRoutes'
import Logo from '@/components/customui/Logo'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

function GenerateSideBar() {
    const router=useRouter();
  return (
    <div className='h-full w-full border-r flex flex-col overflow-y-auto  shadow-md bg-white'>
       <div className='py-4 px-2 border-b border-black/20 '>
          <Logo/>
       </div>
       <div className='mt-3 mx-3'>
        <Button  className='w-full' onClick={()=>{ router.push("/create")}}>
          <PlusCircle/>  Create
        </Button>
       </div>
       <div className='mt-3 '>
          <GuestRoutes/>
       </div>
       <div className='mt-auto mb-5 mx-4 flex flex-col gap-y-1 p-3 bg-slate-100 rounded-md'>
        <h2 className='text-lg '>Available Credits : 5</h2>
        <Progress value={30} className='h-2'/>
        <h2 className='text-sm text-sky-600'> 1 Out of 5 Credits Used</h2>
        <Link href="/generate/upgrade" className='text-primary text-xs'>Upgrade to create more</Link>
       </div>
    </div>
  )
}

export default GenerateSideBar
