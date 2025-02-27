import React from 'react'
import Categories from './_componenets/Categories'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function page() {
  const {userId} =await auth();
  if(!userId){
    return redirect("/");
  }
  const categories=await db.category.findMany({
    orderBy:{
     name:"asc"
    }
  })  


  return (
    <div>
    <div className="w-full">
      <Categories  items={categories}/>
    
    </div>
    </div>
  )
}

export default page
