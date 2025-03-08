import React from "react";
import MaterialCardItem from "./MaterialCardItem";

function StudyMaterial({ courseId }: { courseId: string }) {

  
  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare it",
      iconType: "notes", // Changed to string identifier
      path: `/material/${courseId}/notes`,
    },
    {
      name: "Flashcard",
      desc: "Flashcards help to remember the concepts",
      iconType: "flashcard", // Changed to string identifier
      path: `/material/${courseId}/flashcards`,
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      iconType: "quiz", // Changed to string identifier
      path: `/material/${courseId}/quiz`,
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      iconType: "question", // Changed to string identifier
      path: `/material/${courseId}/answer`,
    },
  ];

  return (
    <div className="my-3">
      <h1 className="text-sky-600 text-xl font-bold text-center md:text-3xl">
        Study Material
      </h1>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mt-3">
        {MaterialList.map((item, index) => (
          <MaterialCardItem 
            key={index} 
            name={item.name} 
            desc={item.desc} 
            iconType={item.iconType} 
            path={item.path} 
            courseId={courseId}
          />
        ))}
      </div>
    </div>
  );
}

export default StudyMaterial;