import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import getanayltics from "../../../../../../actions/get-analytics";
import { BarChartBig, CircleIcon } from "lucide-react";
import { AnalyticsSummaryCards } from "./_components/AnalyticsSummaryCards";
import { TopPerformingCourse } from "./_components/TopPerformingCourse";
import { CategoryBreakdown } from "./_components/CategoryBreakdown";
import dynamic from "next/dynamic";
import { CoursesList } from "./_components/CourseList";
import RevenueBarChart from "./_components/RevenurBarChart";

// Dynamically import the client component with no SSR
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ClientCategoryBreakdown = dynamic(
  () =>
    import("./_components/CategoryBreakdown").then(
      (mod) => mod.CategoryBreakdown
    ),
  { ssr: false }
);

async function page() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const analytics = await getanayltics({ userId });
  if (!analytics.summary) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-6 rounded-xl shadow-md">
        <BarChartBig className="text-gray-500 w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Analytics Data
        </h2>
        <p className="text-gray-500 text-sm mt-2 text-center">
          Analytics data is currently unavailable. Please check back later or
          ensure data is being collected.
        </p>
      </div>
    );
  }
  console.log(
    " the analytics summary are ",
    analytics.summary?.categorySummary
  );
  return (
    <div className="p-6 flex flex-col gap-y-4">
      <div className="flex items-center gap-x-3 mb-4">
        <div className="p-2 w-fit rounded-md bg-slate-100">
          <CircleIcon className="w-8 h-8  text-sky-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Track your course performance and revenue
          </p>
        </div>
      </div>
      <div className="space-y-6 mt-6">
        <AnalyticsSummaryCards summary={analytics.summary} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopPerformingCourse course={analytics.summary.topPerformingCourse} />
        <CategoryBreakdown categories={analytics.summary.categorySummary} />
      </div>

      <RevenueBarChart courses={analytics.courses} />
      <CoursesList courses={analytics.courses} />
    </div>
  );
}

export default page;
