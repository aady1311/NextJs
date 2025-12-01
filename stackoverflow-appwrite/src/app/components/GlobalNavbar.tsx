"use client";
import { useAuthStore } from "@/src/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalNavbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="text-xl font-bold text-gray-900">StackOverflow Clone</Link>
                        <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                        <Link href="/questions" className="text-gray-700 hover:text-blue-600">Questions</Link>
                        <Link href="/questions/ask" className="text-gray-700 hover:text-blue-600">Ask Question</Link>
                        <Link href={`/users/${user.$id}/${user.name?.replace(/\s+/g, '-').toLowerCase()}`} className="text-gray-700 hover:text-blue-600">My Profile</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user.name}</span>
                        <span className="text-sm text-gray-500">({user.prefs?.reputation || 0} rep)</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}