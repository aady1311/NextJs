import { databases } from "@/src/models/server/config";
import { db, questionCollection } from "@/src/models/name";
import { Query } from "node-appwrite";

export default async function UserQuestions({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    
    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(10)
        ]);

        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Questions ({questions.total})</h2>
                {questions.documents.length > 0 ? (
                    <div className="space-y-4">
                        {questions.documents.map((question) => (
                            <div key={question.$id} className="border-b pb-4">
                                <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                                    {question.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Asked {new Date(question.$createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No questions asked yet.</p>
                )}
            </div>
        );
    } catch (error) {
        return <p className="text-red-600">Error loading questions.</p>;
    }
}