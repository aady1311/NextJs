import { databases, users } from "@/src/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/src/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/src/app/components/magicui/shimmer-button";
import QuestionCard from "@/src/app/components/QuestionCard";
import { UserPrefs } from "@/src/store/Auth";
import Pagination from "@/src/app/components/Pagination";
import Search from "./Search";

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
    const params = await searchParams;
    params.page ||= "1";

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+params.page - 1) * 25),
        Query.limit(25),
    ];

    if (params.tag) queries.push(Query.equal("tags", params.tag));
    if (params.search)
        queries.push(
            Query.or([
                Query.search("title", params.search),
                Query.search("content", params.search),
            ])
        );

    const questions = await databases.listDocuments(db, questionCollection, queries);
    console.log("Questions", questions)

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            try {
                const [author, answers, votes] = await Promise.all([
                    users.get<UserPrefs>(ques.authorId).catch(() => null),
                    databases.listDocuments(db, answerCollection, [
                        Query.equal("questionId", ques.$id),
                        Query.limit(1),
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("type", "question"),
                        Query.equal("typeId", ques.$id),
                        Query.limit(1),
                    ]),
                ]);

                return {
                    ...ques,
                    totalAnswers: answers.total,
                    totalVotes: votes.total,
                    author: author ? {
                        $id: author.$id,
                        reputation: author.prefs?.reputation || 0,
                        name: author.name,
                    } : {
                        $id: "unknown",
                        reputation: 0,
                        name: "Unknown User",
                    },
                };
            } catch (error) {
                return {
                    ...ques,
                    totalAnswers: 0,
                    totalVotes: 0,
                    author: {
                        $id: "unknown",
                        reputation: 0,
                        name: "Unknown User",
                    },
                };
            }
        })
    );

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 pb-20 pt-24">
                <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            All Questions
                        </h1>
                        <p className="text-gray-300">
                            {questions.total} {questions.total === 1 ? 'question' : 'questions'} from our community
                        </p>
                    </div>
                    <Link href="/questions/ask">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                                ✨ Ask a Question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>
                
                <div className="mb-8">
                    <Search />
                </div>
                
                {questions.documents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🤔</div>
                        <h3 className="text-2xl font-semibold mb-2 text-white">No questions found</h3>
                        <p className="text-gray-300 mb-6">
                            {params.search || params.tag 
                                ? "Try adjusting your search or filters" 
                                : "Be the first to ask a question!"}
                        </p>
                        <Link href="/questions/ask">
                            <ShimmerButton>
                                <span className="text-white font-medium">
                                    Ask the First Question
                                </span>
                            </ShimmerButton>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.documents.map(ques => (
                            <QuestionCard key={ques.$id} ques={ques} />
                        ))}
                    </div>
                )}
                
                {questions.total > 25 && (
                    <div className="mt-12">
                        <Pagination total={questions.total} limit={25} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
