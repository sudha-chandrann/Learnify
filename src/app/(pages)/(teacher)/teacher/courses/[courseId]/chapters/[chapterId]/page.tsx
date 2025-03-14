import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/customui/IconBadge";
import TitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import ChapterActions from "./_components/ChapterActionButton";


const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const { userId } = await auth();

  const { courseId, chapterId } =  await params;

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `( ${completedFields}/${totalFields})`;
  const iscomplete=requiredFields.every(Boolean);


  return (
    <>
      {
        !chapter.isPublished && (
          <div className="border text-center p-4 text-sm flex items-center w-full bg-yellow-200/80 border-yellow-30 text-primary">
            <AlertTriangle className="h-4 w-4 mr-2 "/>
           This chapter is unpublished.It is not be visible in the course
          </div>
        )
      }
      <div className="p-6 ">
        <div className="flex items-center justify-between ">
          <div className="w-full ">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6 text-slate-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center flex-wrap justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-semibold text-sky-800">
                  Chapter Creation
                </h1>
                <span>Complete all fields {completionText}</span>
              </div>
              <div className="ml-auto mt-2">
                <ChapterActions disabled={!iscomplete} chapterId={chapterId} courseId={courseId} isPublished={chapter.isPublished}/>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 ">
          <div className="space-y-4 w-full justify-items-center mb-6">
            <div className="flex items-center gap-x-2 w-full lg:w-4/5">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl text-slate-600">Customize your chapter</h2>
            </div>
            <TitleForm
              initialData={chapter}
              chapterId={chapterId}
              courseId={courseId}
            />
            <ChapterDescriptionForm chapterId={chapterId} courseId={courseId} initialData={chapter}/>
            
            <div className="flex items-center gap-x-2 w-full lg:w-4/5">
              <IconBadge icon={Eye} />
              <h2 className="text-xl text-slate-600">Access Settings</h2>
            </div>
            <ChapterAccessForm chapterId={chapterId} courseId={courseId} initialData={chapter} />

          </div>
          <div className="space-y-4  w-full justify-items-center mb-6">
            <div className="flex items-center gap-x-2 w-full lg:w-4/5">
              <IconBadge icon={Video} />
              <h2 className="text-lg text-slate-600">Add a video</h2>
            </div>
            <ChapterVideoForm chapterId={chapterId} courseId={courseId} initialData={chapter}/>

          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
