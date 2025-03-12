import { Filter } from "lucide-react";

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex items-center gap-2 mb-3">
      <Filter size={18} className="text-gray-600" />
      <h2 className="text-lg font-semibold">Filter by Category</h2>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null
            ? "bg-sky-600 text-white shadow-sm"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category
              ? "bg-sky-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  </div>
);
export default CategoryFilter;
