import React from 'react';

function ChapterCard({ content }: { content: string }) {
  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chapter content container */}
      <div className="p-6 md:p-8">
        <article 
          className="prose prose-lg max-w-none prose-headings:text-blue-700 prose-a:text-blue-600 prose-strong:font-bold prose-code:text-red-500 prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

export default ChapterCard;