import { databases } from "@/src/models/server/config";
import { db, voteCollection } from "@/src/models/name";
import { Query } from "node-appwrite";

export default async function UserVotes({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    
    try {
        const votes = await databases.listDocuments(db, voteCollection, [
            Query.equal("votedById", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(10)
        ]);

        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Votes ({votes.total})</h2>
                {votes.documents.length > 0 ? (
                    <div className="space-y-4">
                        {votes.documents.map((vote) => (
                            <div key={vote.$id} className="border-b pb-4">
                                <p className="text-gray-700">
                                    <span className={vote.voteStatus === 'upvoted' ? 'text-green-600' : 'text-red-600'}>
                                        {vote.voteStatus === 'upvoted' ? '↑' : '↓'}
                                    </span>
                                    {' '}Voted on {vote.type}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    {new Date(vote.$createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No votes cast yet.</p>
                )}
            </div>
        );
    } catch (error) {
        return <p className="text-red-600">Error loading votes.</p>;
    }
}