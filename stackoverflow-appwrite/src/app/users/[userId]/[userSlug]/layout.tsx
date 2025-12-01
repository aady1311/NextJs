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
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                                <p className="text-lg text-gray-600 mb-2">{user.email}</p>
                                <p className="text-sm text-gray-500">
                                    Member since {convertDateToRelativeTime(new Date(user.$createdAt))}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Last active {convertDateToRelativeTime(new Date(user.$updatedAt))}
                                </p>
                            </div>
                            <EditButton />
                        </div>
                    </div>
                    <Navbar />
                    <div className="bg-white rounded-lg shadow p-6">
                        {children}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading user in layout:', error);
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                        <p>Error loading user: {error instanceof Error ? error.message : 'Unknown error'}</p>
                        <p className="text-sm mt-2">User ID: {userId}</p>
                        <p className="text-sm">Check server logs for more details</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default Layout;
