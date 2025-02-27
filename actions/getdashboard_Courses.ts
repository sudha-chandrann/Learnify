
import { db } from "@/lib/db"; // Assuming you have the db connection setup
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./getProgress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashBoardCourses = {
  completedCourse: CourseWithProgressWithCategory[];
  courseInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (userId: string): Promise<DashBoardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true
              }
            }
          }
        }
      }
    });

    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

    // eslint-disable-next-line prefer-const
    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter((course) => course.progress === 100);
    const courseInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourse: completedCourses,
      courseInProgress: courseInProgress
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourse: [],
      courseInProgress: []
    };
  }
};
