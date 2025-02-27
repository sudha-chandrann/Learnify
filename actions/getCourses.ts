import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./getProgress";


type CourseWithProgressWithcategory = Course & {
    category:Category|null;
    chapters:{id:string}[];
    progress:number| null;
}

type getCourses = {
    userId:string;
    title?:string;
    categoryId?:string;
}

export const getCourses= async ({
    userId,
    title,
    categoryId
}:getCourses):Promise<CourseWithProgressWithcategory[]>=>{
   try{
    const courses= await db.course.findMany({
        where:{
            isPublished:true,
            title:{
                contains:title,
            },
            categroyId:categoryId,
        },
        include:{
            category:true,
            chapters:{
                where:{
                    isPublished:true
                },
                select:{
                    id:true
                }
            },
            purchases:{
                where:{
                    userId
                }
            }
        },
        orderBy:{
            createAt:"desc"
        }
    });
    

    const coursesWithProgress:CourseWithProgressWithcategory[]= await Promise.all(
        courses.map(async (course) => {
            if(course.purchases.length === 0){
                return {
                    ...course,
                    progress:null,

                }
            }
            const progressPercentage= await getProgress(userId,course.id);
            return {
                ...course,
                progress:progressPercentage
            }
        })
    )


   return coursesWithProgress;
   }
  catch(error){
    console.error("[GET_COURSES]",error);
    return [];
  }
}