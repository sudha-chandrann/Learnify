import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FileText, Play, Download, Tag, DollarSign, Clock, Users, Paperclip } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseAttachment from "./_components/CourseAttachment";

async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  
  const course = await db.course.findUnique({
    where: {
      id: courseId
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        }
      },
      attachments: true,
      category: true
    }
  });

  if (!course) {
    return redirect("/");
  }

  const totalChapters = course.chapters.length;




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Course Image and Basic Info */}
      <div className="relative w-full h-80 bg-gradient-to-r from-sky-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image 
          src={course.imageUrl || "/placeholder-course.jpg"} 
          alt={course.title} 
          fill 
          className="object-cover z-0"
          priority
        />
        <div className="relative z-20 max-w-6xl mx-auto px-4 h-full flex flex-col justify-end pb-8">
          {course.category && (
            <Badge className="mb-3 w-full bg-sky-500 hover:bg-sky-600">
              {course.category.name}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {course.title}
          </h1>
          <p className="text-white/80 text-lg mb-4">
            Created by <span className="font-medium text-white">{course.author}</span>
          </p>
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Play size={16} />
              <span>{totalChapters} chapters</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>All levels</span>
            </div>
            {course.category && (
              <div className="flex items-center gap-1">
                <Tag size={16} />
                <span>{course.category.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Column - Course Details */}
        <div className="md:col-span-2 space-y-8">
          {/* Course Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">About This Course</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {course.description || "No description available for this course."}
              </p>
            </div>
          </div>

          {/* Course Attachments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Course Resources</h2>
            
            {course.attachments.length > 0 ? (
              <div className="space-y-4">
                {course.attachments.map((attachment) => (
                  <CourseAttachment attachment={attachment} key={attachment.id}/>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                <Paperclip className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No attachments available</h3>
                <p className="text-gray-500 max-w-md">
                  This course doesn&apos;t have any downloadable resources yet.
                </p>
              </div>
            )}
          </div>
          
          {/* Course Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Course Content Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Play className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalChapters}</p>
                <p className="text-gray-500">Total Chapters</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <FileText className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{course.attachments.length}</p>
                <p className="text-gray-500">Resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing and Actions */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-sky-500 sticky top-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</h3>
              <p className="text-gray-500">Full course access</p>
            </div>
            
            <Button className="w-full h-12 mb-4 text-md bg-sky-600 hover:bg-sky-700">
              <DollarSign className="mr-2 h-5 w-5" />
              Purchase Course
            </Button>
            
            <div className="space-y-4 text-sm">
              <div className="flex gap-3 items-start">
                <Play className="h-5 w-5 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium">Full Access</p>
                  <p className="text-gray-500">Access all {totalChapters} chapters</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Download className="h-5 w-5 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium">Resources Included</p>
                  <p className="text-gray-500">Download all {course.attachments.length} course materials</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Clock className="h-5 w-5 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium">Lifetime Access</p>
                  <p className="text-gray-500">Learn at your own pace</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Course Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">About This Course</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Suitable for all levels</span>
              </div>
              {course.category && (
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Category: {course.category.name}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Last updated: {new Date(course.updateAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsPage;