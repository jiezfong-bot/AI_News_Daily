import { translate } from 'google-translate-api-x';

// Simple in-memory cache for translations to avoid hitting API limits
const translationCache: Record<string, string> = {};

export async function translateText(text: string): Promise<string> {
    if (!text || !text.trim()) return text;

    // Check cache first
    const cacheKey = text.trim();
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        // Attempt translation to Simplified Chinese
        const res = await translate(text, { to: 'zh-CN' });
        const translated = res.text;

        // Cache the result
        translationCache[cacheKey] = translated;

        return translated;
    } catch (error) {
        console.error("Translation failed for:", text.slice(0, 20) + "...", error);
        // Fallback to original text if translation fails
        return text;
    }
}

export async function translateBatch(texts: string[]): Promise<string[]> {
    if (!texts || texts.length === 0) return [];

    try {
        // translate-api-x supports array input
        const res = await translate(texts, { to: 'zh-CN' }) as any;
        // @ts-ignore - The type definition might imply single object return but for array input it returns array or object with text array
        // Actually, let's verify the return type. 
        // If it returns an array of objects:
        if (Array.isArray(res)) {
            return res.map((r: any) => r.text);
        }
        // If it returns a single object with text as array (depending on version/fork)
        if (Array.isArray(res.text)) {
            return res.text;
        }
        // Fallback for single item?
        if (typeof res.text === 'string' && texts.length === 1) {
            return [res.text];
        }

        // Paranoid fallback
        return texts;
    } catch (error) {
        console.error("Batch translation failed", error);
        return texts;
    }
}
