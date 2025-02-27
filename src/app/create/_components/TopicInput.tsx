import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TopicInput() {
  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-6">
        Enter topic or paste the content for which you want to generate study
        material
      </h2>
      <Textarea placeholder="Start writing here ..." className="mt-2" />
      <h2 className="text-center text-2xl font-bold  my-4">
        Select the difficulty Level
      </h2>
      
      <Select>
        <SelectTrigger className="w-full mx-auto">
          <SelectValue placeholder="Difficulty Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Moderate">Moderate</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopicInput;
