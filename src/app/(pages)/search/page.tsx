import React from 'react'
import Categories from './_componenets/Categories'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CoursesList from '@/components/customui/CourseList';
import { getCourses } from '../../../../actions/getCourses';
interface SearchPageProps{
  searchParams:Promise<{
    title:string;
    category:string;
  }>
}

async function page({
  searchParams
}:SearchPageProps) {
  const {userId} =await auth();
  const {title,category}= await searchParams;
  if(!userId){
    return redirect("/");
  }
  const categories=await db.category.findMany({
    orderBy:{
     name:"asc"
    }
  })  

  const courses=await getCourses({userId:userId,title:title,categoryId:category})

  return (
    <div>
    <div className="w-full">
      <Categories  items={categories}/>
      <CoursesList items={courses}/>
    </div>
    </div>
  )
}

export default page
