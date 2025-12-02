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
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">⭐</div>
                            <h2 className="text-xl font-semibold text-white">Reputation</h2>
                        </div>
                        <p className="text-4xl font-bold text-blue-400">
                            {user.prefs?.reputation || 0}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">Community points earned</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm p-6 rounded-xl border border-green-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">❓</div>
                            <h2 className="text-xl font-semibold text-white">Questions</h2>
                        </div>
                        <p className="text-4xl font-bold text-green-400">
                            {questionsCount}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">Questions asked</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">✅</div>
                            <h2 className="text-xl font-semibold text-white">Answers</h2>
                        </div>
                        <p className="text-4xl font-bold text-purple-400">
                            {answersCount}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">Answers provided</p>
                    </div>
                </div>
                
                {/* Activity Summary */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📊</span>
                        Activity Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">{user.prefs?.reputation || 0}</p>
                            <p className="text-sm text-gray-400">Total Reputation</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">{questionsCount}</p>
                            <p className="text-sm text-gray-400">Questions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{answersCount}</p>
                            <p className="text-sm text-gray-400">Answers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-orange-400">{Math.floor((user.prefs?.reputation || 0) / 10)}</p>
                            <p className="text-sm text-gray-400">Badges</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading user profile:', error);
        const { userId } = await params;
        return (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-lg">
                <p className="font-medium">Error loading user profile: {error instanceof Error ? error.message : 'Unknown error'}</p>
                <p className="text-sm mt-2 text-red-300">User ID: {userId}</p>
            </div>
        );
    }
};

export default Page;
