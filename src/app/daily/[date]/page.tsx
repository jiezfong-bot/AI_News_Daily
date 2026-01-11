import { getDailyPost } from "@/lib/data";
import { ArrowLeft, ArrowUpRight, Calendar, Share2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

type Props = {
    params: { date: string }
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { date } = await params;
    const post = await getDailyPost(date);

    if (!post) {
        return {
            title: 'Daily News Not Found',
        }
    }

    return {
        title: `${post.title} - AI 资讯日报`,
        description: post.intro || `AI News Daily digest for ${date}`,
        openGraph: {
            title: post.title,
            description: post.intro,
            url: `/daily/${date}`,
            type: 'article',
            publishedTime: post.date,
        },
    }
}

// This is a dynamic route for the daily detail page
export default async function DailyPage({ params }: Props) {
    const { date } = await params;
    const dailyPost = await getDailyPost(date);

    if (!dailyPost) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: dailyPost.title,
        datePublished: dailyPost.date,
        description: dailyPost.intro,
        author: {
            '@type': 'Organization',
            name: 'AI News Daily'
        },
    };

    return (
        <main className="min-h-screen bg-gray-50/50 pb-20 pt-10">
            <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-indigo-100/50 ring-1 ring-gray-100">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Header Image / Pattern */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                </div>

                <div className="px-8 pb-12 pt-8 sm:px-12">
                    {/* Navigation & date */}
                    <div className="mb-10 flex items-center gap-4 text-sm text-gray-500">
                        <Link href="/" className="flex items-center gap-1 font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            返回首页
                        </Link>
                        <span className="h-4 w-px bg-gray-300" />
                        <time className="font-medium text-gray-900">
                            {new Date(dailyPost.date).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>

                    <header className="mb-12">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            {dailyPost.title}
                        </h1>
                        <p className="text-xl leading-8 text-gray-600">
                            {dailyPost.intro}
                        </p>

                        <div className="mt-6 flex items-center gap-4">
                            <button className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                                <Share2 className="h-4 w-4" />
                                分享
                            </button>
                            <div className="flex gap-2">
                                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">AI News</span>
                                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Daily</span>
                            </div>
                        </div>
                    </header>

                    {/* List of News Items */}
                    <div className="space-y-12">
                        {dailyPost.items.map((item, index) => (
                            <div key={item.id} className="group relative flex gap-6 transition-all sm:gap-8">
                                {/* Timeline line */}
                                <div className="absolute left-[27px] top-14 -bottom-12 w-px bg-gray-200 group-last:hidden"></div>

                                {/* Number Badge */}
                                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 group-hover:ring-indigo-500 group-hover:scale-110 transition-all duration-300">
                                    <span className="text-xl font-bold text-gray-400 group-hover:text-indigo-600">
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="rounded-2xl bg-gray-50 p-6 transition-colors hover:bg-gray-50/80 sm:p-8">
                                        {item.imageUrl && (
                                            <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                                <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                        )}

                                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
                                            <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                                                <span className="absolute inset-0 sm:hidden"></span>
                                                {item.title}
                                            </a>
                                        </h2>
                                        <p className="mt-3 text-base leading-7 text-gray-600">
                                            {item.summary}
                                        </p>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                                {item.sourceName}
                                            </span>

                                            <a
                                                href={item.sourceUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                            >
                                                阅读原文
                                                <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer of card */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-gray-400">End of Report</p>
                    </div>

                </div>
            </article>
        </main>
    );
}
