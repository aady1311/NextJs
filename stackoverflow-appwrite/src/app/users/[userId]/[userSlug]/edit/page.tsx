"use client";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditProfile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [description, setDescription] = useState(user?.prefs?.description || "");
    const [message, setMessage] = useState("");

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        try {
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.$id,
                    name: name.trim(),
                    description: description.trim()
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage("Profile updated successfully! ✅");
                setTimeout(() => {
                    router.push(`/users/${user.$id}/${user.name?.replace(/\s+/g, '-').toLowerCase()}`);
                }, 1500);
            } else {
                setMessage("Failed to update profile ❌");
            }
        } catch (error) {
            setMessage("Error updating profile ❌");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
        router.push("/login");
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Edit Profile</h2>
                <p className="text-gray-400">Update your personal information and professional details</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${
                    message.includes('✅') 
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                                Professional Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 resize-none"
                                placeholder="Describe your professional role, skills, and expertise (e.g., Full Stack Developer, React Specialist, DevOps Engineer)"
                            />
                            <p className="text-xs text-gray-400 mt-1">Tell others about your professional background and expertise</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400">Email:</span>
                            <p className="text-white font-medium">{user.email}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Reputation:</span>
                            <p className="text-white font-medium">{user.prefs?.reputation || 0} points</p>
                        </div>
                        <div>
                            <span className="text-gray-400">User ID:</span>
                            <p className="text-white font-medium font-mono text-xs">{user.$id}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Member Since:</span>
                            <p className="text-white font-medium">{new Date(user.$createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <div className="bg-red-500/10 backdrop-blur-sm p-6 rounded-xl border border-red-500/30">
                <h3 className="text-xl font-semibold text-red-400 mb-4">🚨 Danger Zone</h3>
                <p className="text-gray-300 mb-4 text-sm">This action will log you out of your account.</p>
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 border border-red-500/30"
                >
                    {isLoading ? "Logging out..." : "Logout Account"}
                </button>
            </div>
        </div>
    );
}