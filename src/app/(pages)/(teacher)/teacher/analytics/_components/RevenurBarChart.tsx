"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CourseRevenueData {
  id: string;
  title: string;
  totalRevenue: number;
}

interface RevenueBarChartProps {
  courses: CourseRevenueData[];
}
 const RevenueBarChart = ({ courses }: RevenueBarChartProps) => {
  // Sort courses by revenue (highest to lowest)
  const sortedCourses = [...courses]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map(course => ({
      name: course.title,
      revenue: course.totalRevenue
    }));

  // Truncate long course titles for better display
  const processedData = sortedCourses.map(course => ({
    name: course.name.length > 20 ? `${course.name.substring(0, 20)}...` : course.name,
    revenue: course.revenue,
    fullName: course.name // Keep the full name for tooltip
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Revenue Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {processedData.length === 0 ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-muted-foreground">No revenue data available</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                  labelFormatter={(label, payload) => {
                    // Use the full name in tooltip
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullName;
                    }
                    return label;
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueBarChart