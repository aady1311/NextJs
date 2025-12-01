import { databases, users } from "@/src/models/server/config";
import { UserPrefs } from "@/src/store/Auth";
import React from "react";
import { answerCollection, db, questionCollection } from "@/src/models/name";
import { Query } from "node-appwrite";

const Page = async ({ params }: { params: Promise<{ userId: string; userSlug: string }> }) => {
    try {
        const { userId } = await params;
        console.log('Loading user profile for userId:', userId);
        
        const user = await users.get<UserPrefs>(userId);
        console.log('User loaded:', user.name);
        
        // Get questions and answers counts
        let questionsCount = 0;
        let answersCount = 0;
        
        try {
            const questions = await databases.listDocuments(db, questionCollection, [
                Query.equal("authorId", userId),
                Query.limit(1),
            ]);
            questionsCount = questions.total;
        } catch (e) {
            console.log('Questions collection not found or empty');
        }
        
        try {
            const answers = await databases.listDocuments(db, answerCollection, [
                Query.equal("authorId", userId),
                Query.limit(1),
            ]);
            answersCount = answers.total;
        } catch (e) {
            console.log('Answers collection not found or empty');
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-medium mb-4">Reputation</h2>
                    <p className="text-4xl font-bold text-blue-600">
                        {user.prefs?.reputation || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-medium mb-4">Questions Asked</h2>
                    <p className="text-4xl font-bold text-green-600">
                        {questionsCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-medium mb-4">Answers Given</h2>
                    <p className="text-4xl font-bold text-purple-600">
                        {answersCount}
                    </p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading user profile:', error);
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                <p>Error loading user profile: {error instanceof Error ? error.message : 'Unknown error'}</p>
                <p className="text-sm mt-2">User ID: {userId}</p>
            </div>
        );
    }
};

export default Page;
