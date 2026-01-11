"use client";

import { DailyPost, NewsItem } from "@/types/news";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";

interface DailyCardProps {
    post: DailyPost;
}

export function DailyCard({ post }: DailyCardProps) {
    return (
        <Link href={`/daily/${post.id}`} className="block h-full group active:scale-95 transition-transform duration-200">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:ring-indigo-500/20">

                {/* Date Badge - Enhanced */}
                <div className="absolute right-4 top-4 z-10 flex flex-col items-center justify-center rounded-xl bg-white/90 px-3.5 py-2 text-xs font-semibold shadow-sm backdrop-blur-md ring-1 ring-gray-100 transition-colors group-hover:ring-indigo-100">
                    <span className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">
                        {new Date(post.date).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-gray-900 font-mono">
                        {new Date(post.date).getDate()}
                    </span>
                </div>

                <div className="p-6 md:p-8 flex-1">
                    <div className="mb-6">
                        {/* Tag/Category */}
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-4 bg-indigo-50 w-fit px-2 py-1 rounded-md">
                            <Sparkles className="h-3 w-3" />
                            <span>每日精选</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                            {post.title}
                        </h2>
                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 font-sans">
                            {post.intro}
                        </p>
                    </div>

                    {/* Preview Items */}
                    <div className="space-y-3">
                        {post.items.slice(0, 3).map((item) => (
                            <NewsItemPreview key={item.id} item={item} />
                        ))}

                        {post.items.length > 3 && (
                            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-indigo-500 transition-colors ml-1">
                                <span>+{post.items.length - 3} 更多更新</span>
                                <div className="h-px bg-gray-100 flex-1 group-hover:bg-indigo-100 transition-colors" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto border-t border-gray-50 bg-gray-50/50 px-6 py-4 md:px-8">
                    <div className="flex w-full items-center justify-between text-sm font-semibold text-indigo-600 transition-transform group-hover:translate-x-1">
                        阅读日报
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </article>
        </Link>
    );
}

function NewsItemPreview({ item }: { item: NewsItem }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50 group/item">
            {item.imageUrl && !imageError ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                        sizes="48px"
                        onError={() => setImageError(true)}
                        unoptimized
                    />
                </div>
            ) : (
                <div className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    <Sparkles className="h-3 w-3" />
                    每日精选
                </div>
            )}
            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-sm font-medium text-gray-900 group-hover/item:text-indigo-600 transition-colors" title={item.title}>
                    {item.title}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-indigo-300 transition-colors" />
                    {item.sourceName}
                </p>
            </div>
        </div>
    );
}

function NewspaperIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
        </svg>
    )
}
