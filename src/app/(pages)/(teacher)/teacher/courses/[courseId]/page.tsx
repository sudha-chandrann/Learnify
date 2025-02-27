import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import { IconBadge } from "@/components/customui/IconBadge";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChapterForm from "./_components/ChapterForm";
import CourseActions from "./_components/CourseAction";

async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    console.error("User not authenticated");
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: courseId, userId },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/teacher/courses");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categroyId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;
  const iscomplete=requiredFields.every(Boolean);

  return (
    <>
      <div className="h-full p-6 w-full md:px-12">
        <div className="flex items-center flex-wrap justify-between w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-600">
              Complete all fields {completionText}
            </span>
          </div>
          <div>
            <CourseActions isPublished={course.isPublished} courseId={courseId} disabled={!iscomplete}/>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="space-y-4 w-full justify-items-center mb-6">
            <div className="flex items-center gap-x-2 w-full min-w-[320px] lg:w-4/5">
              <IconBadge icon={LayoutDashboard} />
              <h1 className="text-lg text-slate-600">Customize your course</h1>
            </div>
            <TitleForm
              initialData={{ title: course.title }}
              courseId={courseId}
            />
            <DescriptionForm
              initialData={{ description: course.description || "" }}
              courseId={courseId}
            />
            <ImageForm
              initialData={{ imageUrl: course.imageUrl || "" }}
              courseId={courseId}
            />
            <CategoryForm
              initialData={{ categroyId: course.categroyId }}
              courseId={courseId}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className=" space-y-4 w-full justify-items-center mb-6">
            <div className="flex items-center gap-x-2 w-full lg:w-4/5 min-w-[320px]">
              <IconBadge icon={ListChecks} />
              <h1 className="text-lg text-slate-600"> Course Chapters</h1>
            </div>
            <ChapterForm courseId={courseId} initialData={course}/>

            <div className="flex items-center gap-x-2 w-full lg:w-4/5 min-w-[320px]">
              <IconBadge icon={CircleDollarSign} />
              <h1 className="text-lg text-slate-600"> Sell Your Course</h1>
            </div>
            <PriceForm
              initialData={{ price: course.price }}
              courseId={courseId}
            />
            <div className="flex items-center gap-x-2 w-full lg:w-4/5 min-w-[320px]">
              <IconBadge size="sm" icon={File}/>
              <h1 className="text-sm text-slate-600">
                Resource and Attachments
              </h1>
            </div>
            <AttachmentForm initialData={course} courseId={courseId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
