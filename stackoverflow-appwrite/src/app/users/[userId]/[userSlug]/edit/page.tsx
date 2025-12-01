"use client";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditProfile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
        router.push("/login");
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Account Information</h3>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.$id}</p>
                    <p><strong>Reputation:</strong> {user.prefs?.reputation || 0}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Profile Editing</h3>
                    <p className="text-yellow-700 text-sm">
                        Profile editing features are not implemented yet. 
                        This would typically include updating name, bio, avatar, etc.
                    </p>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
}