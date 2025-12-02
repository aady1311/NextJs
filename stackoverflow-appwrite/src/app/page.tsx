"use client";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { databases } from "@/src/models/client/config";
import { db, questionCollection, answerCollection } from "@/src/models/name";
import { Query } from "appwrite";
import { Globe } from "@/components/ui/globe";
import {MagicCard} from "@/src/app/components/magicui/magic-card";
import ShimmerButton from "@/src/app/components/magicui/shimmer-button";
import NumberTicker from "@/src/app/components/magicui/number-ticker";
import { BackgroundBeams } from "@/src/app/components/ui/background-beams";
import AnimatedGridPattern from "@/src/app/components/magicui/animated-grid-pattern";
import Toast from "@/src/app/components/Toast";
import { cn } from "@/src/lib/utils";

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: []
};

export default function Home() {
  const { session, user, logout, hydrated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    userQuestions: 0,
    userAnswers: 0
  });
  const [isSetupLoading, setIsSetupLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  useEffect(() => {
    if (hydrated && !session) {
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
        // Set default stats on error
        setStats({
          totalQuestions: 0,
          totalAnswers: 0,
          userQuestions: 0,
          userAnswers: 0
        });
      }
    };
    
    // Disable stats fetching to prevent authorization errors
    // if (user) {
    //   fetchStats();
    // }
  }, [session, router, user]);

  const handleSetup = async () => {
    setIsSetupLoading(true);
    try {
      const [dbResponse, notificationResponse] = await Promise.all([
        fetch('/api/setup'),
        fetch('/api/setup-notifications', { method: 'POST' })
      ]);
      
      const [dbData, notificationData] = await Promise.all([
        dbResponse.json(),
        notificationResponse.json()
      ]);
      
      if (dbResponse.ok && notificationResponse.ok) {
        setToast({ message: 'Database and notifications setup completed! 🎉', type: 'success' });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setToast({ message: 'Setup failed. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Setup error:', error);
      setToast({ message: 'Setup failed. Please check your connection and try again.', type: 'error' });
    } finally {
      setIsSetupLoading(false);
    }
  };

  if (!hydrated || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
        <BackgroundBeams />
        <div className="text-center z-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Loading...</h1>
          <p className="text-lg text-gray-300">{!hydrated ? 'Loading...' : 'Redirecting to login...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 text-white/10",
        )}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome to DevStack
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Where developers connect, learn, and grow together. Ask questions, share knowledge, and build amazing things.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/questions/ask">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                    Ask Your First Question
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="/questions">
                <button className="px-8 py-3 rounded-lg border border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 transition-colors text-lg font-medium text-white backdrop-blur-sm">
                  Browse Questions
                </button>
              </Link>
            </div>
          </div>

          {/* Globe Section */}
          <div className="relative h-[500px] w-full max-w-[700px] mx-auto mb-20">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <AnimatedGridPattern
                numSquares={40}
                maxOpacity={0.08}
                duration={4}
                repeatDelay={2}
                className={cn(
                  "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                  "text-blue-400/20",
                )}
              />
            </div>
            
            {/* Realistic Earth Globe */}
            <Globe 
              className="opacity-90" 
              config={{
                ...GLOBE_CONFIG,
                width: 700,
                height: 700,
                baseColor: [0.05, 0.2, 0.4], // Deep ocean blue
                markerColor: [1, 0.3, 0.1], // Bright orange-red markers
                glowColor: [0.3, 0.7, 1], // Atmospheric blue glow
                mapBrightness: 1.5, // Brighter landmasses
                diffuse: 0.8,
                dark: 0.1, // Less darkness for better visibility
                markers: [
                  // Major tech hubs with larger, more visible sizes
                  { location: [37.7749, -122.4194], size: 0.15 }, // San Francisco
                  { location: [40.7128, -74.0060], size: 0.15 }, // New York
                  { location: [51.5074, -0.1278], size: 0.12 }, // London
                  { location: [35.6762, 139.6503], size: 0.12 }, // Tokyo
                  { location: [52.5200, 13.4050], size: 0.10 }, // Berlin
                  { location: [55.7558, 37.6176], size: 0.10 }, // Moscow
                  { location: [19.0760, 72.8777], size: 0.12 }, // Mumbai
                  { location: [39.9042, 116.4074], size: 0.12 }, // Beijing
                  { location: [-23.5505, -46.6333], size: 0.10 }, // São Paulo
                  { location: [43.6532, -79.3832], size: 0.08 }, // Toronto
                  { location: [-33.8688, 151.2093], size: 0.08 }, // Sydney
                  { location: [1.3521, 103.8198], size: 0.08 }, // Singapore
                ]
              }}
            />
            
            {/* Enhanced floating particles around globe */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-pulse ${
                    i % 3 === 0 ? 'w-2 h-2 bg-orange-400/60' :
                    i % 3 === 1 ? 'w-1.5 h-1.5 bg-blue-400/50' :
                    'w-1 h-1 bg-cyan-400/40'
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${1.5 + Math.random() * 2.5}s`
                  }}
                />
              ))}
            </div>
            
            {/* Transparent text overlay with focus on animations */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center z-20 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-300 via-white to-blue-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                  🌍 Global Community
                </h3>
                <p className="text-white/90 drop-shadow-2xl text-xl font-semibold mb-4">
                  Developers from around the world
                </p>
                <div className="flex justify-center gap-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce shadow-lg shadow-orange-400/50" style={{animationDelay: '0s'}} />
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50" style={{animationDelay: '0.3s'}} />
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{animationDelay: '0.6s'}} />
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{animationDelay: '0.9s'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-4xl mb-2">❓</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Questions</h3>
                <p className="text-3xl font-bold mb-1 text-white">
                  <NumberTicker value={stats.totalQuestions} />
                </p>
                <p className="text-gray-400 text-sm">Total questions</p>
              </div>
            </MagicCard>
            
            <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-xl font-semibold mb-2 text-green-400">Answers</h3>
                <p className="text-3xl font-bold mb-1 text-white">
                  <NumberTicker value={stats.totalAnswers} />
                </p>
                <p className="text-gray-400 text-sm">Total answers</p>
              </div>
            </MagicCard>
            
            <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-4xl mb-2">🙋</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-400">My Questions</h3>
                <p className="text-3xl font-bold mb-1 text-white">
                  <NumberTicker value={stats.userQuestions} />
                </p>
                <p className="text-gray-400 text-sm">Questions asked</p>
              </div>
            </MagicCard>
            
            <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm">
              <div className="p-6 text-center">
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="text-xl font-semibold mb-2 text-orange-400">Reputation</h3>
                <p className="text-3xl font-bold mb-1 text-white">
                  <NumberTicker value={user?.prefs?.reputation || 0} />
                </p>
                <p className="text-gray-400 text-sm">Reputation points</p>
              </div>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/questions" className="group">
              <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300 backdrop-blur-sm">
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">Browse Questions</h3>
                  <p className="text-gray-300">Explore questions from the community and find solutions to common problems</p>
                </div>
              </MagicCard>
            </Link>
            
            <Link href="/questions/ask" className="group">
              <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all duration-300 backdrop-blur-sm">
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">💡</div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">Ask Question</h3>
                  <p className="text-gray-300">Get help from the community by asking detailed questions about your coding challenges</p>
                </div>
              </MagicCard>
            </Link>
            
            <MagicCard className="cursor-pointer border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm">
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Notification System</h3>
                <p className="text-gray-300 mb-6">Get notified when someone tags you (@username) or upvotes your content</p>
                <div className="space-y-3">
                  <button
                    onClick={handleSetup}
                    disabled={isSetupLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSetupLoading ? 'Setting up...' : 'Setup Database & Notifications'}
                  </button>
                  <div className="text-sm text-gray-400">
                    ✨ Features: @mentions, upvote notifications, real-time bell icon
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Welcome back, {user?.name}! 👋</h2>
          <p className="text-lg text-gray-300 mb-8">
            Ready to dive into coding discussions? Your journey to becoming a better developer continues here.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/users/${user?.$id}/${user?.name?.replace(/\s+/g, '-').toLowerCase()}`}>
              <button className="px-6 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors font-medium text-white border border-gray-700 backdrop-blur-sm">
                View My Profile
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
