"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`,
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <nav className="flex flex-wrap gap-2">
                {items.map(item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            pathname === item.href 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
