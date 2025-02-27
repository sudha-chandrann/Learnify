'use client';
import React from 'react'
import {Layout,Compass,List, BarChart2, Sparkles, LayoutDashboard, Shield, UserCircle} from "lucide-react"
import { usePathname } from 'next/navigation';
import SidebarItem from './SidebarItem';


const guestRoutes=[
    {
        icon:Layout,
        lable:"Dashboard",
        href:"/dashboard"
    },
    {
        icon:Compass,
        lable:"Browser",
        href:"/search"
    },
    {
        icon:Sparkles,
        lable:"Study Material Generater",
        href:"/generate"
    },
]

const teacherRoutes=[
  {
      icon:List,
      lable:"Courses",
      href:"/teacher/courses"
  },
  {
      icon:BarChart2,
      lable:"Analytics",
      href:"/teacher/analytics"
  },
]

const generateRoutes=[
  {
      icon:LayoutDashboard,
      lable:"Dashboard",
      href:"/generate"
  },
  {
      icon:Shield,
      lable:"Upgrade",
      href:"/generate/upgrade"
  },
  {
      icon:UserCircle,
      lable:"Profile",
      href:"/generate/profile"
  },
]


function GuestRoutes() {
    
     const pathname=usePathname();
     const isTeacherPage=pathname?.startsWith("/teacher");
     const isgeneratePage=pathname?.startsWith("/generate");
     const routes= isTeacherPage?teacherRoutes:isgeneratePage?generateRoutes:guestRoutes;

  return (
    <div className='flex flex-col w-full'>
      {
        routes.map((route)=>(
            <SidebarItem key={route.href} icon={route.icon} label={route.lable} href={route.href}/>
        ))
      }
    </div>
  )
}

export default GuestRoutes
