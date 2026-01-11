import { DailyPost } from "@/types/news";
import { DailyCard } from "./DailyCard";

interface NewsFeedProps {
    posts: DailyPost[];
}

export function NewsFeed({ posts }: NewsFeedProps) {
    return (
        <section className="py-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <DailyCard post={post} />
                    </div>
                ))}
            </div>
        </section>
    );
}
