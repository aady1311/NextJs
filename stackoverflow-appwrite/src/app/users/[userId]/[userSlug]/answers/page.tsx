import { databases } from "@/src/models/server/config";
import { db, answerCollection } from "@/src/models/name";
import { Query } from "node-appwrite";

export default async function UserAnswers({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    
    try {
        const answers = await databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(10)
        ]);

        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Answers ({answers.total})</h2>
                {answers.documents.length > 0 ? (
                    <div className="space-y-4">
                        {answers.documents.map((answer) => (
                            <div key={answer.$id} className="border-b pb-4">
                                <p className="text-gray-700">{answer.content.substring(0, 200)}...</p>
                                <p className="text-gray-600 text-sm mt-1">
                                    Answered {new Date(answer.$createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No answers given yet.</p>
                )}
            </div>
        );
    } catch (error) {
        return <p className="text-red-600">Error loading answers.</p>;
    }
}