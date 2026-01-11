import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    template: "%s | AI 资讯日报",
    default: "AI News Daily | AI 资讯日报",
  },
  description: "每日 AI 行业动态速览，聚合 Wired, Hacker News, DeepMind 等前沿科技资讯。",
  metadataBase: new URL("https://ai-news-daily-rouge.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI News Daily | AI 资讯日报",
    description: "每日 AI 行业动态速览，一站式掌握全球 AI 技术与商业新闻。",
    url: "/",
    siteName: "AI News Daily",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI News Daily | AI 资讯日报",
    description: "每日 AI 行业动态速览",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Analytics } from "@vercel/analytics/react";

// ... (existing code)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
