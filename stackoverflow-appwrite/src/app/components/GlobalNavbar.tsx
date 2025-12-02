"use client";
import { useAuthStore } from "@/src/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ShimmerButton from "@/src/app/components/magicui/shimmer-button";
import NotificationBell from "@/src/app/components/NotificationBell";

export default function GlobalNavbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (!user) return null;

    return (
        <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            DevStack
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="/questions" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Questions
                            </Link>
                            <Link href="/questions/ask" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Ask Question
                            </Link>
                            <Link href={`/users/${user.$id}/${user.name?.replace(/\s+/g, '-').toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors font-medium">
                                Profile
                            </Link>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4">
                        {/* <NotificationBell /> */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.prefs?.reputation || 0} reputation</p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-300 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-800">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link href="/" className="block px-3 py-2 text-gray-300 hover:text-white font-medium">
                                Home
                            </Link>
                            <Link href="/questions" className="block px-3 py-2 text-gray-300 hover:text-white font-medium">
                                Questions
                            </Link>
                            <Link href="/questions/ask" className="block px-3 py-2 text-gray-300 hover:text-white font-medium">
                                Ask Question
                            </Link>
                            <Link href={`/users/${user.$id}/${user.name?.replace(/\s+/g, '-').toLowerCase()}`} className="block px-3 py-2 text-gray-300 hover:text-white font-medium">
                                Profile
                            </Link>
                            <div className="px-3 py-2 border-t border-gray-800">
                                <p className="text-sm font-medium text-white mb-1">{user.name}</p>
                                <p className="text-xs text-gray-400 mb-3">{user.prefs?.reputation || 0} reputation</p>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}