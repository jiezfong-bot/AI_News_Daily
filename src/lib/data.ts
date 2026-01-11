import { DailyPost, NewsItem } from "@/types/news";
import Parser from "rss-parser";
import { translateText, translateBatch } from "./translate";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = process.env.NODE_ENV === 'production'
    ? "/tmp"
    : path.join(process.cwd(), "src", "data");
const CACHE_FILE_PATH = path.join(DATA_DIR, "news-cache.json");

const RSS_FEEDS = [
    "https://www.wired.com/feed/rss",
    "https://www.technologyreview.com/feed",
    "https://www.a16z.news/feed",
    "https://openai.com/news/rss.xml",
    "https://www.qbitai.com/feed",
    "https://www.huxiu.com/rss/0.xml",
    "https://www.tmtpost.com/rss.xml",
    "https://a.jiemian.com/index.php?m=article&a=rss",
    "https://36kr.com/feed",
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.ithome.com/rss/",
    "https://feed.infoq.com/",
    "https://huggingface.co/blog/feed.xml",
    "https://blog.google/products/gemini/rss",
    "https://www.theverge.com/rss/index.xml",
    "https://arstechnica.com/tag/ai/feed/",
    "https://deepmind.google/blog/rss.xml"
];

// Fallback mock data in case RSS fails
export const mockDailyPosts: DailyPost[] = [
    {
        id: "2024-01-09",
        date: "2024-01-09",
        title: "1月9日 AI 动态 (Mock)",
        intro: "数据获取失败，显示演示数据。",
        items: [
            {
                id: "news-1",
                title: "System Update: RSS Feed Connection Error",
                summary: "Unable to connect to the live RSS feed. Please check your internet connection or try again later.",
                sourceUrl: "#",
                sourceName: "System",
                tags: ["Error"],
            },
        ],
    },
];

// Simple in-memory cache
let cachedData: DailyPost[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper to create deterministic ID
function generateId(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
}

// Persistence Helpers
async function loadCacheFromDisk() {
    try {
        const data = await fs.readFile(CACHE_FILE_PATH, "utf-8");
        const parsed = JSON.parse(data);
        if (parsed.lastUpdated && Array.isArray(parsed.data)) {
            cachedData = parsed.data;
            lastFetchTime = parsed.lastUpdated;
            console.log("Loaded news cache from disk, items:", parsed.data.length);
        }
    } catch (error) {
        // Ignore error (file not found)
    }
}

async function saveCacheToDisk(data: DailyPost[]) {
    try {
        // Retention Policy: Keep only last 30 daily posts
        const pruned = data.slice(0, 30);
        const cacheObject = {
            lastUpdated: Date.now(),
            data: pruned
        };
        // Ensure directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheObject, null, 2));
        console.log("Saved news cache to disk.");
    } catch (error) {
        console.error("Failed to save cache:", error);
    }
}

export async function fetchDailyPosts(): Promise<DailyPost[]> {
    const now = Date.now();

    // 1. Memory Check
    if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
        return cachedData;
    }

    // 2. Disk Check (if memory empty)
    if (!cachedData) {
        await loadCacheFromDisk();
        // Check again after load
        if (cachedData && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            return cachedData;
        }
    }

    try {
        const parser = new Parser();

        // Fetch all feeds in parallel
        const feedPromises = RSS_FEEDS.map(async (url) => {
            try {
                const feed = await parser.parseURL(url);
                return feed.items.map(item => ({ ...item, sourceName: feed.title || "Unknown Source" }));
            } catch (e) {
                console.error(`Failed to fetch ${url}`, e);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        const allItems = results.flat();

        // Group items by date
        const postsByDate: Record<string, NewsItem[]> = {};

        allItems.forEach((item) => {
            // Filter out items without date
            if (!item.pubDate && !item.isoDate) return;

            const pubDate = new Date(item.pubDate || item.isoDate || new Date());
            // Filter out invalid dates or future dates (sanity check)
            if (isNaN(pubDate.getTime()) || pubDate > new Date()) return;

            const dateStr = pubDate.toISOString().split("T")[0]; // YYYY-MM-DD

            if (!postsByDate[dateStr]) {
                postsByDate[dateStr] = [];
            }

            // Basic deduplication using URL or Title
            const isDuplicate = postsByDate[dateStr].some(
                existing => existing.sourceUrl === item.link || existing.title === item.title
            );
            if (isDuplicate) return;

            // Extract image if available
            // @ts-ignore
            const imageUrl = item.enclosure?.url || item['media:content']?.['$']?.url || undefined;

            // Use deterministic ID based on link or title
            const uniqueString = item.guid || item.link || item.title || "";
            const itemId = generateId(uniqueString);

            const newsItem: NewsItem = {
                id: itemId,
                title: item.title || "No Title",
                summary: item.contentSnippet || item.content || "",
                sourceUrl: item.link || "#",
                sourceName: item.sourceName?.replace(/^The /, '') || "RSS Source", // Clean up source names
                tags: ["AI"], // Placeholder tags
                imageUrl,
            };

            postsByDate[dateStr].push(newsItem);
        });

        // Convert map to array and sort by date descending
        const dailyPosts: DailyPost[] = Object.keys(postsByDate)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((date) => {
                const items = postsByDate[date];
                return {
                    id: date,
                    date: date,
                    title: `${new Date(date).getMonth() + 1}月${new Date(date).getDate()}日 AI 动态`,
                    intro: `今日更新: ${items.length} 条资讯`,
                    items: items,
                };
            });

        // Translate the latest 15 days of news for better UX
        // We do this AFTER mapping to DailyPost to keep the logic clean, but before caching
        if (dailyPosts.length > 0) {
            // Translate the latest 15 days of news for better UX
            const recentPosts = dailyPosts.slice(0, 15);

            // Process sequentially to be nice to the API
            for (const post of recentPosts) {
                const itemsToTranslate = post.items.slice(0, 10);
                if (itemsToTranslate.length === 0) continue;

                try {
                    // Batch translate titles
                    const titles = itemsToTranslate.map(i => i.title);
                    const summaries = itemsToTranslate.map(i => i.summary.slice(0, 150));

                    // Run both batches in parallel (2 requests per day)
                    const [tTitles, tSummaries] = await Promise.all([
                        translateBatch(titles),
                        translateBatch(summaries)
                    ]);

                    // Assign back
                    itemsToTranslate.forEach((item, index) => {
                        if (tTitles[index]) item.title = tTitles[index];
                        if (tSummaries[index]) item.summary = tSummaries[index];
                    });

                } catch (e) {
                    console.warn(`Translation failed for date ${post.date}`, e);
                }

                // Add a small delay between days to avoid QPS limits
                await new Promise(r => setTimeout(r, 200));
            }
        }

        cachedData = dailyPosts;
        lastFetchTime = now;
        await saveCacheToDisk(dailyPosts);
        return dailyPosts;
    } catch (error) {
        console.error("Error fetching RSS:", error);
        return mockDailyPosts;
    }
}

export async function getDailyPost(id: string): Promise<DailyPost | undefined> {
    const posts = await fetchDailyPosts();
    return posts.find((post: DailyPost) => post.id === id);
}
