"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CategorySummary {
  [key: string]: {
    totalSales: number;
    totalRevenue: number;
    courseCount: number;
  }
}

export const CategoryBreakdown = ({ 
  categories 
}: { 
  categories: CategorySummary 
}) => {
  const categoryData = Object.entries(categories).map(([name, data], index) => ({
    name,
    value: data.totalRevenue,
    color: `hsl(${index * 40}, 70%, 50%)`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No category data available</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};