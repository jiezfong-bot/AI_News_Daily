import { fetchDailyPosts } from "@/lib/data";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await fetchDailyPosts();

    const entries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `http://localhost:3000/daily/${post.id}`, // specific post URL
        lastModified: new Date(post.date),
        changeFrequency: "daily",
        priority: 0.7,
    }));

    // Add home page
    return [
        {
            url: "http://localhost:3000",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...entries,
    ];
}
