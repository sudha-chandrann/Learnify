// components/analytics/summary-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, BarChart } from "lucide-react";

interface AnalyticsSummary {
  totalCourses: number;
  publishedCourses: number;
  totalRevenue: number;
  totalSales: number;
}

export const AnalyticsSummaryCards = ({ summary }: { summary: AnalyticsSummary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              ${summary.totalRevenue.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {summary.totalSales}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {summary.totalCourses}
            </span>
            <span className="text-sm text-muted-foreground">
              ({summary.publishedCourses} published)
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Published Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {summary.totalCourses > 0 
                ? `${((summary.publishedCourses / summary.totalCourses) * 100).toFixed(0)}%` 
                : "0%"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
