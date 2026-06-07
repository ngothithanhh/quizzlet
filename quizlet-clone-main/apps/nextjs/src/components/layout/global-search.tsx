"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const GlobalSearch = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative hidden items-center md:flex w-[240px] lg:w-[320px] ml-4"
    >
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        placeholder="Tìm kiếm học phần..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full rounded-full border border-input bg-muted/50 pl-9 pr-4 py-1.5 text-sm shadow-sm transition-colors hover:bg-muted focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </form>
  );
};

export default GlobalSearch;
