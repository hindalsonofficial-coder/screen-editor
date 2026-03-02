import { NextResponse } from 'next/server';

const LANG_CODES: Record<string, string> = {
    'Hindi': 'hi',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Chinese (Simplified)': 'zh-CN',
    'Chinese (Traditional)': 'zh-TW',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Arabic': 'ar',
    'Portuguese': 'pt',
    'Italian': 'it',
    'Dutch': 'nl',
    'Russian': 'ru',
    'Turkish': 'tr',
    'Vietnamese': 'vi',
    'Thai': 'th',
    'Indonesian': 'id',
    'English': 'en',
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, targetLang } = body as { text?: string; targetLang?: string };

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid text' }, { status: 400 });
        }

        const targetCode = targetLang && LANG_CODES[targetLang] ? LANG_CODES[targetLang] : 'hi';
        if (targetCode === 'en') {
            return NextResponse.json({ translated: text });
        }

        const langpair = `en|${targetCode}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error('Translation service error');
        }

        const data = await res.json();
        const translated = data.responseData?.translatedText ?? text;

        return NextResponse.json({ translated });
    } catch (error) {
        console.error('Translate API error:', error);
        return NextResponse.json(
            { error: 'Translation failed' },
            { status: 500 }
        );
    }
}
