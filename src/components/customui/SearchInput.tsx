"use client";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useDebounce } from "../../../hooks/use-debounce";

function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Initialize with current search param if it exists
  const initialValue = searchParams.get("title") || "";
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value);
  
  const currentCategoryId = searchParams.get("categoryId");
  
  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue, // Changed from 'search' to 'title' to match getCourses param
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          className="w-full pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
          placeholder="Search for a course"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchInput;