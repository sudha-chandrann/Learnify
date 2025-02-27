import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import { getChapter } from "../../../../../../actions/getchapterdata";
import VideoPlayer from "./_components/VideoPlayer";
import CourseProgressButton from "./_components/CourseProgressButton";
import CourseEnrollButton from "../../_components/CourseEnrollementButton";
import Preview from "@/components/customui/Preview";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";




async function page({
  params,
}: {
  params:Promise< {
    courseId: string;
    chapterId: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {courseId,chapterId}= await params;
  const {
    chapter,
    course,
    muxData,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: userId,
    courseId: courseId,
    chapterId: chapterId,
  });

  if (!chapter || !course) {
    return redirect("/dashboard");
  }

  const isLocked = !chapter.isFree && !purchase;
  const onCompeleOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
        {
            userProgress?.isCompleted && (
                <div className="bg-emerald-700 border-emerald-800 text-secondary border text-center p-4 text-sm flex items-center w-full">
                <CheckCircleIcon className='h-4 w-4 mr-2'/>
                You already completed this chapter.
             </div>
            )
        }
        {
            isLocked && (
            <div className="bg-yellow-200/80 border-yellow-30 text-primary border text-center p-4 text-sm flex items-center w-full">
                <AlertTriangle className='h-4 w-4 mr-2'/>
                You need  to purchase this course to watch this chapter.
             </div>
            )
        }
      <div className="flex flex-col max-w-4xl mx-auto pb-10">
        <div className="px-4 pt-4">
        <VideoPlayer
          chapterId={chapterId}
          courseId={courseId}
          title={chapter.title}
          nextChapterId={nextChapter?.id||""}
          playbackId={muxData?.playbackId||""}
          isLocked={isLocked}
          completeOnEnd={onCompeleOnEnd}
         />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-5 px-4">
          <h1 className="text-2xl font-semibold mb-2">
            {chapter.title}
          </h1>
          {
            purchase?(
              <div>
                <CourseProgressButton
                 chapterId={chapterId}
                 courseId={courseId}
                 nextChapterId={nextChapter?.id}
                 isCompleted={!!userProgress?.isCompleted}
                />
              </div>
            ):(
              <CourseEnrollButton
              courseId={courseId}
              price={course.price!}
              />
            )
          }
        </div>

        <div className="w-full my-3 px-4">
          <Preview content={chapter.description!}/>
        </div>





      </div>
    </div>
  );
}

export default page;
