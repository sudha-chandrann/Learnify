import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotesSideBar from "./NotesSideBar";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
function NotesNavBar({courseId}:{courseId:string}) {
  return (
    <div className="h-full shadow-md w-full flex px-3 md:px-5  items-center ">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <NotesSideBar courseId={courseId} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-x-3 ml-auto mr-3">
        <Link href={`/material/${courseId}`}>
          <Button variant="teacher" size="teacher">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotesNavBar;
