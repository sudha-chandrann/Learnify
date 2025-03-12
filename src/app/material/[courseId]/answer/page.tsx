import { db } from '@/lib/db';
import React from 'react'
import QACollectionDisplay from './_components/QACollectionDisplay';

async function page({params}:{params:{courseId:string}}) {
  const {courseId}=params;
  const qacollection= await db.qACollection.findUnique({
    where: {
      studyMaterialId:courseId
    },
  })

  if (!qacollection) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center p-8 rounded-lg bg-slate-50 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Q&A Collection Found</h2>
          <p className="text-slate-600">This course doesn&apos;t have any questions and answers yet.</p>
        </div>
      </div>
    );
  }
  const qapairs= await db.qAPair.findMany({
    where:{
      collectionId:qacollection?.id
    }
  })
  if(qapairs.length<1){
    return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center p-8 rounded-lg bg-slate-50 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Q&A Pairs Found</h2>
        <p className="text-slate-600">This course doesn&apos;t have any questions and answers yet.</p>
      </div>
    </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <QACollectionDisplay qacollection={qacollection} qapairs={qapairs} />
    </div>
  )
}

export default page
