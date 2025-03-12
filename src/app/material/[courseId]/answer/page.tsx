import { db } from '@/lib/db';
import React from 'react'

async function page({params}:{params:{courseId:string}}) {
  const {courseId}=params;
  const qacollection= await db.qACollection.findUnique({
    where: {
      studyMaterialId:courseId
    },
    include:{
      qaPairs:true
    }
  })
  console.log(" the qa collection is ",qacollection)
  return (
    <div>
      
    </div>
  )
}

export default page
