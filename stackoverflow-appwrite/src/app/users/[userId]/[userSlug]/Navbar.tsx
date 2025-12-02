"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "📊 Summary",
            href: `/users/${userId}/${userSlug}`,
        },
        {
            name: "❓ Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "✅ Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "🗳️ Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 mb-6">
            <nav className="flex flex-wrap gap-2">
                {items.map(item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            pathname === item.href 
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
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
