"use client";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const { logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
            Logout
        </button>
    );
}