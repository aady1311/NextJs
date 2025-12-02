"use client";

import { useAuthStore } from "@/src/store/Auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const EditButton = () => {
    const { userId, userSlug } = useParams();
    const { user } = useAuthStore();

    if (user?.$id !== userId) return null;

    return (
        <Link
            href={`/users/${userId}/${userSlug}/edit`}
            className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-6 py-3 text-sm font-medium text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200"
        >
            <span className="flex items-center gap-2">
                <span>✏️</span>
                Edit Profile
            </span>
        </Link>
    );
};

export default EditButton;
