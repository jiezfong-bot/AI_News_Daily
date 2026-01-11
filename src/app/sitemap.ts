import { fetchDailyPosts } from "@/lib/data";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await fetchDailyPosts();

    const entries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `https://ai-news-daily-rouge.vercel.app/daily/${post.id}`, // specific post URL
        lastModified: new Date(post.date),
        changeFrequency: "daily",
        priority: 0.7,
    }));

    // Add home page
    return [
        {
            url: "https://ai-news-daily-rouge.vercel.app",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...entries,
    ];
}
