import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, Trophy } from "lucide-react";

interface AnalyticsCourseData {
  id: string;
  title: string;
  totalRevenue: number;
  totalPurchases: number;
  completionRate: number;
}

export const TopPerformingCourse = ({ 
  course 
}: { 
  course: AnalyticsCourseData | null 
}) => {
  if (!course) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Course</CardTitle>
          <CardDescription>No course data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle>Top Performing Course</CardTitle>
        </div>
        <CardDescription>Your highest revenue-generating course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${course.totalRevenue.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Purchases</span>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">{course.totalPurchases}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Completion</span>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">{course.completionRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
