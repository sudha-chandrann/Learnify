import Link from "next/link";

interface SuccessPageProps {
  params: {
    courseId: string;
  };
}

export default function CourseSuccessPage({ params }: SuccessPageProps) {
  return (
    <div className="mt-24 bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You now have access to the course.
        </p>
        
        <div className="space-y-3">
          <Link
            href={`/courses/${params.courseId}`}
            className="block w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition duration-200"
          >
            Start Learning
          </Link>
          
          <Link
            href="/dashboard"
            className="block w-full text-sky-600 hover:text-sky-700 transition duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}