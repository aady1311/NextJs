"use client";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AskQuestion() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const content = formData.get("content");
        const tags = formData.get("tags");


        if (!title || !content || !tags) {
            setError("Please fill all fields");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.toString(),
                    content: content.toString(),
                    tags: tags.toString(),
                    authorId: user.$id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create question');
            }

            router.push("/questions");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create question");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ask a Question</h1>
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                                Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                placeholder="What's your programming question? Be specific."
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows={10}
                                required
                                className="w-full px-3 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                placeholder="Provide details about your question. Include what you've tried and what you expect to happen."
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
                                Tags
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                placeholder="javascript, react, nodejs (comma separated)"
                            />
                        </div>



                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200"
                            >
                                {isLoading ? "Posting..." : "Post Question"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/questions")}
                                className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}