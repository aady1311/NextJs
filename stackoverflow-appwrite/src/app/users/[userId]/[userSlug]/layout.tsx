import { users } from "@/src/models/server/config";
import { UserPrefs } from "@/src/store/Auth";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    try {
        const { userId } = await params;
        console.log('Loading user in layout for userId:', userId);
        const user = await users.get<UserPrefs>(userId);
        console.log('User loaded in layout:', user.name);

        return (
            <div className="min-h-screen bg-black py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        {user.name}
                                    </h1>
                                    <p className="text-lg text-gray-300 mb-2">{user.email}</p>
                                    {user.prefs?.description && (
                                        <p className="text-gray-300 mb-3 bg-gray-800/30 px-3 py-2 rounded-lg">
                                            💼 {user.prefs.description}
                                        </p>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
                                        <p className="flex items-center gap-1">
                                            <span>📅</span>
                                            Member since {convertDateToRelativeTime(new Date(user.$createdAt))}
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <span>🕒</span>
                                            Last active {convertDateToRelativeTime(new Date(user.$updatedAt))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <EditButton />
                        </div>
                    </div>
                    <Navbar />
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                        {children}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading user in layout:', error);
        const { userId } = await params;
        return (
            <div className="min-h-screen bg-black py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-lg">
                        <p className="font-medium">Error loading user: {error instanceof Error ? error.message : 'Unknown error'}</p>
                        <p className="text-sm mt-2 text-red-300">User ID: {userId}</p>
                        <p className="text-sm text-red-300">Check server logs for more details</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default Layout;
