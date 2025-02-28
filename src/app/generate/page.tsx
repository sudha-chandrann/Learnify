import WelcomeBanner from "./_components/WelcomeBanner";
import {  currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

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

  return (
    <div className="h-full w-full">
      <div className="w-full p-3">
        <WelcomeBanner username={User?.name || "User"} />
      </div>
    </div>
  );
}
