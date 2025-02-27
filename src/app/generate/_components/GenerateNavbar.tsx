"use client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavRoutes from "@/components/customui/NavRoutes";
import GenerateSideBar from "./GenerateSideBar";

function GenerateNavBar() {

  return (
    <div className="h-full shadow-md  flex px-4  items-center justify-between ">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <GenerateSideBar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="ml-auto">
        <NavRoutes />
      </div>
    </div>
  );
}

export default GenerateNavBar;
