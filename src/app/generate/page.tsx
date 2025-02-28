import WelcomeBanner from "./_components/WelcomeBanner";
import {  currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CourseLayout from "./_components/CourseLayout";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  let User = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!User) {
    console.log("User is not present. Creating user...");
    try {
      User = await db.user.create({
        data: {
          id: user.id,
          name: `${user.firstName} ${user.lastName || ""}`.trim(),
          email: user.emailAddresses[0].emailAddress,
        },
      });
    } catch (error) {
      console.error("Error during user creation", error);
    }
  }

  const courses= await db.studyMaterial.findMany({
    where: {
      createdby:user.id
    }
  })

  return (
    <div className="h-full w-full">
      <div className="w-full p-3">
        <WelcomeBanner username={User?.name || "User"} />
      </div>
      <div className="w-full p-3">
        {courses.length>=1 &&( <div className="my-2 mx-4 font-extrabold text-2xl text-sky-700">Your Study Materials</div>)}
        <CourseLayout courses={courses}/>
      </div>
    </div>
  );
}
