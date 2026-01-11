export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  tags: string[];
  imageUrl?: string;
}

export interface DailyPost {
  id: string;
  date: string; // YYYY-MM-DD
  title: string; // e.g. "12月20日 AI 动态"
  intro: string; // Brief summary of the day or editor's note
  items: NewsItem[];
}
