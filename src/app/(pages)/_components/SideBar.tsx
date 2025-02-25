import React from 'react'
import GuestRoutes from './GuestRoutes'
import Logo from '@/components/customui/Logo'

function SideBar() {
  return (
    <div className='h-full w-full border-r flex flex-col overflow-y-auto  shadow-md bg-white'>
       <div className='py-2 px-2 '>
          <Logo/>
       </div>
       <div className='mt-3'>
        <GuestRoutes/>
       </div>
    </div>
  )
} 

export default SideBar
