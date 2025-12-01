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
        const attachment = formData.get("attachment") as File;

        if (!title || !content || !tags) {
            setError("Please fill all fields");
            setIsLoading(false);
            return;
        }

        try {
            let attachmentId = null;
            
            // Upload file if provided
            if (attachment && attachment.size > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', attachment);
                uploadFormData.append('authorId', user.$id);
                
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                });
                
                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    attachmentId = uploadData.fileId;
                }
            }

            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.toString(),
                    content: content.toString(),
                    tags: tags.toString(),
                    authorId: user.$id,
                    attachmentId
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Ask a Question</h1>
                
                <div className="bg-white rounded-lg shadow p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="What's your programming question? Be specific."
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows={10}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Provide details about your question. Include what you've tried and what you expect to happen."
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="javascript, react, nodejs (comma separated)"
                            />
                        </div>

                        <div>
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                                Attachment (Optional)
                            </label>
                            <input
                                id="attachment"
                                name="attachment"
                                type="file"
                                accept="image/*"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">Supported: Images only (JPG, PNG, GIF - Max 5MB)</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? "Posting..." : "Post Question"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/questions")}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
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