
"use client"
import React from "react";
import MaterialCardItem from "./MaterialCardItem";

interface StudyMaterialProps {
  courseId: string;
}

 
function StudyMaterial({ courseId }: StudyMaterialProps) {
  
  // Define the base materials that are available for all courses
  const materialTypes = [
    {
      id: "notes",
      name: "Notes/Chapters",
      desc: "Read notes to prepare for your studies",
      iconType: "notes",
      basePath: `/material/${courseId}/notes`,
    },
    {
      id: "flashcard",
      name: "Flashcards",
      desc: "Flashcards help to remember the concepts",
      iconType: "flashcard",
      basePath: `/material/${courseId}/flashcards`,
    },
    {
      id: "quiz",
      name: "Quiz",
      desc: "Great way to test your knowledge",
      iconType: "quiz",
      basePath: `/material/${courseId}/quiz`,
    },
    {
      id: "question",
      name: "Question/Answer",
      desc: "Help to practice your learning",
      iconType: "question",
      basePath: `/material/${courseId}/answer`,
    },
  ];


  return (
    <div className="my-6">
      <h1 className="text-sky-600 text-xl font-bold text-center md:text-3xl mb-6">
        Study Material
      </h1>
      

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {materialTypes.map((item) => (
            <MaterialCardItem
              key={item.id}
              name={item.name}
              desc={item.desc}
              iconType={item.iconType}
              path={item.basePath}
              courseId={courseId}
            />
          ))}
        </div>
  
    </div>
  );
}

export default StudyMaterial;