import { db } from "@/lib/db";
import {  Chapter } from "@prisma/client";


interface GetChapterProps {
    userId:string;
    chapterId: string;
    courseId:string;
}


export const getChapter = async ({
    userId,
    chapterId,
    courseId
}:GetChapterProps)=>{
    try{
          const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
          });
           
          const course = await db.course.findUnique({
            where:{
                isPublished:true,
                id:courseId
            },
            select:{
                price:true,
                description:true
            }
          })
          const chapter = await db.chapter.findUnique({
            where:{
                id:chapterId,
                isPublished:true,
            }
          })

          if(!chapter || !course){
              throw new Error("Chapter or course not found")  
          }

          let muxData = null;
          let nextChapter:Chapter| null = null;


          if(chapter.isFree || purchase){
            muxData= await db.muxData.findUnique({
                where:{
                    chapterId:chapterId
                }
            });
            nextChapter = await db.chapter.findFirst({
                 where:{
                    courseId:courseId,
                    isPublished:true,
                    position:{
                        gt:chapter?.position
                    }
                 },
                 orderBy:{
                    position: 'asc'
                 }
            });
          }
           
          const userProgress = await db.userProgress.findUnique({
            where:{
                userId_chapterId:{
                    userId:userId,
                    chapterId:chapterId
                }
            }
          });

          return {
            chapter,
            course,
            muxData,
            nextChapter,
            userProgress,
            purchase
          }
    }
    catch(error){
        console.log("[GET_CHAPTER]",error);
        return {
            chapter:null,
            course:null,
            muxData:null,
            nextChapter:null,
            userProgress:null,
            purchase:null
        }
    }
}