import { fetchDailyPosts } from "@/lib/data"; // Import server action/function
import { DailyCard } from "@/components/news/DailyCard";

export default async function Home() {
  const dailyPosts = await fetchDailyPosts();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-50 opacity-50 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24 text-center">
          <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 mb-6 ring-1 ring-inset ring-indigo-600/10">
            <span>🚀 每日 AI 资讯聚合</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            <span className="block mb-2">掌握未来科技，洞见</span>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI 时代</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 mb-10">
            聚合全网最优质的 AI 技术博客与新闻。一站式掌握 Hacker News, OpenAI, DeepMind 等前沿动态。
          </p>
        </div>
      </div>

      {/* Daily Cards Grid */}
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {dailyPosts.map((post) => (
            <DailyCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-100 bg-gray-50 py-12 text-center text-sm text-gray-500">
        <p>© 2026 AI News Daily. Powered by Gemini.</p>
      </footer>
    </main>
  );
}
