import { db } from "@/lib/db";
import FlashcardStudy from "./_components/FlashcardStudy";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./_components/DeleteButton";
async function FlashcardsPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;

  // Fetch flashcard set
  const flashcardSet = await db.flashcardSet.findUnique({
    where: {
      studyMaterialId: courseId,
    },
  });

  // Fetch flashcards
  const flashcards = flashcardSet
    ? await db.flashcard.findMany({
        where: {
          flashcardSetId: flashcardSet.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    : [];

  // If no flashcard set found
  if (!flashcardSet) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        {/* Back button */}

          <Link
            href={`/material/${courseId}`}
            className="flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6 "
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Study Materials
          </Link>
     
        

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">No Flashcards Available</h1>
          <p className="text-gray-600 mb-6">
            There are no flashcards associated with this study material yet.
          </p>
          <a
            href={`/generate/flashcards?courseId=${courseId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Flashcards
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className=" flex items-center justify-between p-2 sm:p-4 max-w-4xl mx-auto">
        <Link
          href={`/material/${courseId}`}
          className="flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6 "
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Study Materials
        </Link>
        <DeleteButton courseId={courseId}/>
      </div>
      <FlashcardStudy flashcardSet={flashcardSet} flashcards={flashcards} />
    </div>
  );
}

export default FlashcardsPage;
