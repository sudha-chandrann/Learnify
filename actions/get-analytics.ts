import { db } from "@/lib/db";

interface AnalyticsCourseData {
  id: string;
  title: string;
  isPublished: boolean;
  category: string;
  totalRevenue: number;
  totalPurchases: number;
  completionRate: number;
  purchasesTrend: { date: string; count: number }[];
  averageRevenue: number;
}

interface CategorySummary {
  [key: string]: {
    totalSales: number;
    totalRevenue: number;
    courseCount: number;
  }
}

interface AnalyticsSummary {
  totalCourses: number;
  publishedCourses: number;
  totalRevenue: number;
  totalSales: number;
  topPerformingCourse: AnalyticsCourseData | null;
  categorySummary: CategorySummary;
}


export  default async function getanayltics({userId}:{userId:string}) {
  try {
    // Get courses by the current teacher
    const courses = await db.course.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        isPublished: true,
        purchases: {
          select: {
            id: true,
            createdAt: true,
            price: true,
            userId: true,
          },
        },
        chapters: {
          select: {
            id: true,
            title: true,
            userProgress: {
              select: {
                isCompleted: true,
                userId: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate analytics data
    const analyticsData: AnalyticsCourseData[] = courses.map((course) => {
      // Total revenue for this course
      const totalRevenue = course.purchases.reduce((acc, purchase) => acc + purchase.price, 0);
      
      // Total purchases
      const totalPurchases = course.purchases.length;
      
      // Calculate completion rates
      const uniqueStudentIds = [...(course.purchases.map(purchase => purchase.userId))];
      const totalStudents = uniqueStudentIds.length;
      
      const completedStudents = course.chapters.length > 0 
        ? uniqueStudentIds.filter(studentId => 
            course.chapters.every(chapter => 
              chapter.userProgress.some(progress => 
                progress.userId === studentId && progress.isCompleted
              )
            )
          ).length
        : 0;
      
      const completionRate = totalStudents > 0 
        ? (completedStudents / totalStudents) * 100 
        : 0;
      
      // Calculate purchase dates for trend analysis
      const purchasesByDate: Record<string, number> = {};
      course.purchases.forEach(purchase => {
        const date = purchase.createdAt.toISOString().split('T')[0];
        purchasesByDate[date] = (purchasesByDate[date] || 0) + 1;
      });

      return {
        id: course.id,
        title: course.title,
        isPublished: course.isPublished,
        category: course.category?.name || "Uncategorized",
        totalRevenue,
        totalPurchases,
        completionRate,
        purchasesTrend: Object.entries(purchasesByDate).map(([date, count]) => ({
          date,
          count,
        })),
        averageRevenue: totalPurchases > 0 ? totalRevenue / totalPurchases : 0,
      };
    });

    // Summary statistics across all courses
    const summary: AnalyticsSummary = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(course => course.isPublished).length,
      totalRevenue: analyticsData.reduce((acc, course) => acc + course.totalRevenue, 0),
      totalSales: analyticsData.reduce((acc, course) => acc + course.totalPurchases, 0),
      topPerformingCourse: analyticsData.length > 0
        ? analyticsData.reduce((prev, current) => 
            (prev.totalRevenue > current.totalRevenue) ? prev : current
          )
        : null,
      categorySummary: analyticsData.reduce((acc: CategorySummary, course) => {
        const category = course.category;
        if (!acc[category]) {
          acc[category] = {
            totalSales: 0,
            totalRevenue: 0,
            courseCount: 0,
          };
        }
        acc[category].totalSales += course.totalPurchases;
        acc[category].totalRevenue += course.totalRevenue;
        acc[category].courseCount += 1;
        return acc;
      }, {}),
    };

    return ({
      courses: analyticsData,
      summary
    });
  } catch {
    return (
        {
            courses:[],
            summary:null

        }
    )
  }
}