import GuestRoutes from '@/app/(pages)/_components/GuestRoutes'
import Logo from '@/components/customui/Logo'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import React from 'react'

function GenerateSideBar() {
  return (
    <div className='h-full w-full border-r flex flex-col overflow-y-auto  shadow-md bg-white'>
       <div className='py-4 px-2 border-b border-black/20 '>
          <Logo/>
       </div>
       <div className='mt-3 mx-3'>
        <Button  className='w-full'>
          <PlusCircle/>  Create
        </Button>
       </div>
       <div className='mt-3 '>
          <GuestRoutes/>
       </div>
    </div>
  )
}

export default GenerateSideBar
