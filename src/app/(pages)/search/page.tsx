import React, { Suspense } from 'react'
import Categories from './_componenets/Categories'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CoursesList from '@/components/customui/CourseList';
import { getCourses } from '../../../../actions/getCourses';
import SearchInput from '@/components/customui/SearchInput';
interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
  }
}

async function page({
  searchParams
}:SearchPageProps) {
  const {userId} =await auth();
  if(!userId){
    return redirect("/");
  }
  const categories=await db.category.findMany({
    orderBy:{
     name:"asc"
    }
  })  

  const courses = await getCourses({
    userId: userId,
    title: searchParams.title,
    categoryId: searchParams.categoryId
  });
  return (
    <div>
    <div className="md:hidden md:mb-0  w-full pt-3 ml-5 flex items-center"> 
      <Suspense>

      <SearchInput />
      </Suspense>
  </div>
    <div className="w-full">
      <Categories  items={categories}/>
      <CoursesList items={courses}/>
    </div>
    </div>
  )
}

export default page
