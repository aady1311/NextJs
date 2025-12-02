"use client";
import { useAuthStore } from "@/src/store/Auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { hydrated } = useAuthStore();

    // Remove automatic session verification to prevent authorization errors

    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}