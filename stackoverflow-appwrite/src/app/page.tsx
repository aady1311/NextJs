"use client";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { databases } from "@/src/models/client/config";
import { db, questionCollection, answerCollection } from "@/src/models/name";
import { Query } from "appwrite";

export default function Home() {
  const { session, user, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    userQuestions: 0,
    userAnswers: 0
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    // Fetch real-time stats
    const fetchStats = async () => {
      try {
        const [questions, answers, userQuestions, userAnswers] = await Promise.all([
          databases.listDocuments(db, questionCollection, [Query.limit(1)]),
          databases.listDocuments(db, answerCollection, [Query.limit(1)]),
          databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", user?.$id || ""),
            Query.limit(1)
          ]),
          databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", user?.$id || ""),
            Query.limit(1)
          ])
        ]);
        
        setStats({
          totalQuestions: questions.total,
          totalAnswers: answers.total,
          userQuestions: userQuestions.total,
          userAnswers: userAnswers.total
        });
      } catch (error) {
        console.log('Error fetching stats:', error);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [session, router, user]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to StackOverflow Clone</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Questions</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalQuestions}</p>
                <p className="text-gray-600 text-sm">Total questions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-green-600">Answers</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalAnswers}</p>
                <p className="text-gray-600 text-sm">Total answers</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-purple-600">My Questions</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.userQuestions}</p>
                <p className="text-gray-600 text-sm">Questions asked</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-orange-600">Your Reputation</h3>
                <p className="text-3xl font-bold text-gray-800">{user?.prefs?.reputation || 0}</p>
                <p className="text-gray-600 text-sm">Reputation points</p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/questions" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Browse Questions</h3>
                <p className="text-gray-600">Explore questions from the community</p>
              </Link>
              
              <Link href="/questions/ask" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Ask Question</h3>
                <p className="text-gray-600">Get help from the community</p>
              </Link>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Setup Database</h3>
                <p className="text-gray-600 mb-4 text-sm">Initialize collections</p>
                <button
                  onClick={() => fetch('/api/setup').then(() => alert('Database setup complete!'))}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Setup DB
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
