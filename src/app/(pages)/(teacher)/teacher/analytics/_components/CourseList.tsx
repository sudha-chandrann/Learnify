import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AnalyticsCourseData {
  id: string;
  title: string;
  isPublished: boolean;
  category: string;
  totalRevenue: number;
  totalPurchases: number;
  completionRate: number;
}

export const CoursesList = ({ courses }: { courses: AnalyticsCourseData[] }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">No courses available</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${course.totalRevenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{course.totalPurchases}</TableCell>
                  <TableCell className="text-right">{course.completionRate.toFixed(0)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};