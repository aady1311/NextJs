"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import { MagicCard } from "./magicui/magic-card";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/src/utils/slugify";
import { avatars } from "@/src/models/client/config";
import convertDateToRelativeTime from "@/src/utils/relativeTime";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
    return (
        <MagicCard className="cursor-pointer border-0 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Stats Section */}
                    <div className="flex sm:flex-col gap-4 sm:gap-2 text-center sm:text-right shrink-0">
                        <div className="flex flex-col items-center sm:items-end">
                            <span className="text-2xl font-bold text-white">{(ques as any).totalVotes}</span>
                            <span className="text-xs text-gray-400">votes</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-end">
                            <span className={`text-2xl font-bold ${
                                (ques as any).totalAnswers > 0 ? 'text-green-400' : 'text-gray-400'
                            }`}>
                                {(ques as any).totalAnswers}
                            </span>
                            <span className="text-xs text-gray-400">answers</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <Link
                            href={`/questions/${ques.$id}/${slugify((ques as any).title)}`}
                            className="group"
                        >
                            <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                {(ques as any).title}
                            </h2>
                        </Link>
                        
                        {/* Content Preview */}
                        <div className="mt-3 text-gray-300 text-sm line-clamp-2">
                            {(ques as any).content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </div>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(ques as any).tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/questions?tag=${tag}`}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-200"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>

                        {/* Author and Time */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {(ques as any).author.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <Link
                                        href={`/users/${(ques as any).author.$id}/${slugify((ques as any).author.name)}`}
                                        className="font-medium text-white hover:text-blue-400 transition-colors duration-200"
                                    >
                                        {(ques as any).author.name}
                                    </Link>
                                    <span className="text-xs text-gray-400">
                                        {(ques as any).author.reputation} reputation
                                    </span>
                                </div>
                            </div>
                            <div className="text-gray-400 text-xs">
                                asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MagicCard>
    );
};

export default QuestionCard;
