"use client";

import { Input } from "@/src/app/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import ShimmerButton from "@/src/app/components/magicui/shimmer-button";

const Search = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");

    React.useEffect(() => {
        setSearch(() => searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        if (search.trim()) {
            newSearchParams.set("search", search.trim());
        } else {
            newSearchParams.delete("search");
        }
        router.push(`${pathname}?${newSearchParams}`);
    };

    const clearSearch = () => {
        setSearch("");
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("search");
        router.push(`${pathname}?${newSearchParams}`);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form className="flex w-full flex-row gap-3" onSubmit={handleSearch}>
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Input
                        type="text"
                        placeholder="Search questions by title or content..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 pr-10 h-12 text-base border-2 border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors backdrop-blur-sm"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <ShimmerButton type="submit" className="h-12 px-6">
                    <span className="text-white font-medium">
                        Search
                    </span>
                </ShimmerButton>
            </form>
            
            {/* Active filters */}
            {(searchParams.get("search") || searchParams.get("tag")) && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {searchParams.get("search") && (
                        <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            <span>Search: "{searchParams.get("search")}"</span>
                            <button
                                onClick={clearSearch}
                                className="hover:bg-blue-500/30 rounded-full p-1 transition-colors"
                            >
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {searchParams.get("tag") && (
                        <div className="flex items-center gap-2 bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                            <span>Tag: {searchParams.get("tag")}</span>
                            <button
                                onClick={() => {
                                    const newSearchParams = new URLSearchParams(searchParams);
                                    newSearchParams.delete("tag");
                                    router.push(`${pathname}?${newSearchParams}`);
                                }}
                                className="hover:bg-gray-600 rounded-full p-1 transition-colors"
                            >
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
