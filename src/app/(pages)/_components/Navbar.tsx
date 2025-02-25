'use client';
import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import SideBar from './SideBar'
import { Menu } from 'lucide-react'
import NavRoutes from '@/components/customui/NavRoutes';

function Navbar() {

  return (
    <div className='h-full shadow-md  flex px-4  items-center justify-between '>
       <div className='md:hidden'>
        <Sheet>
            <SheetTrigger>
                <Menu/>
            </SheetTrigger>
            <SheetContent side="left">
                <SideBar/>
            </SheetContent>
        </Sheet>
        
       </div>

       <div className='ml-auto'>
          <NavRoutes/>
       </div>
        
    </div>
  )
}

export default Navbar
