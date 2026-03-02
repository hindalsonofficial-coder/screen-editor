import { NextResponse } from 'next/server';
import type { EditorElement } from '@/types/editor';
import fs from 'fs/promises';
import path from 'path';
import { FIGMA_COMMUNITY_TEMPLATES } from '@/data/figmaCommunityTemplates';

/**
 * Template API (AppLaunchpad-style + Figma Community)
 * GET /api/templates         → list all templates (builtin, custom, community)
 * GET /api/templates?id=xxx  → get one template (builtin/custom: backgroundColor + elements; community: 404 / open in Figma)
 */

export type TemplateListItem = {
    id: string;
    name: string;
    thumbnail: string | null;
    category?: string;
    /** 'builtin' | 'custom' | 'community' — community tiles open in Figma */
    source?: 'builtin' | 'custom' | 'community';
    author?: string;
    figmaUrl?: string;
    free?: boolean;
    /** Preloaded for instant apply — no second request */
    payload?: { backgroundColor: string; elements: EditorElement[] };
};

export type TemplateDetail = {
    id: string;
    name: string;
    backgroundColor: string;
    elements: EditorElement[];
};

type StoredTemplate = {
    id: string;
    name: string;
    backgroundColor: string;
    elements: EditorElement[];
    category?: string;
};

const CUSTOM_TEMPLATES_PATH = path.join(process.cwd(), 'templates.custom.json');

async function readCustomTemplates(): Promise<StoredTemplate[]> {
    try {
        const raw = await fs.readFile(CUSTOM_TEMPLATES_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch {
        return [];
    }
}

async function writeCustomTemplates(templates: StoredTemplate[]): Promise<void> {
    await fs.writeFile(CUSTOM_TEMPLATES_PATH, JSON.stringify(templates, null, 2), 'utf8');
}

/** Built-in templates removed — only custom + Figma Community templates shown */
const TEMPLATES_LIST: TemplateListItem[] = [];
const TEMPLATES_DATA: Record<string, { backgroundColor: string; elements: EditorElement[] }> = {};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const category = searchParams.get('category');
        const customTemplates = await readCustomTemplates();

        if (id) {
            // Built-in template?
            const data = TEMPLATES_DATA[id];
            const meta = TEMPLATES_LIST.find(t => t.id === id);
            if (data && meta) {
                const response: { template: TemplateDetail } = {
                    template: {
                        id,
                        name: meta.name,
                        backgroundColor: data.backgroundColor,
                        elements: data.elements,
                    },
                };
                return NextResponse.json(response);
            }

            // Custom template?
            const custom = customTemplates.find(t => t.id === id);
            if (!custom) {
                return NextResponse.json({ error: 'Template not found' }, { status: 404 });
            }
            const customResponse: { template: TemplateDetail } = {
                template: {
                    id: custom.id,
                    name: custom.name,
                    backgroundColor: custom.backgroundColor,
                    elements: custom.elements,
                },
            };
            return NextResponse.json(customResponse);
        }

        let builtins: TemplateListItem[] = TEMPLATES_LIST.map(t => {
            const data = TEMPLATES_DATA[t.id];
            return {
                ...t,
                source: 'builtin' as const,
                payload: data ? { backgroundColor: data.backgroundColor, elements: data.elements } : undefined,
            };
        });
        if (category && category.trim()) {
            builtins = builtins.filter(t => t.category === category.trim());
        }

        const customListItems: TemplateListItem[] = customTemplates
            .filter(t => !category || t.category === category.trim())
            .map(t => ({
                id: t.id,
                name: t.name,
                thumbnail: null,
                category: t.category ?? 'Custom',
                source: 'custom' as const,
                payload: { backgroundColor: t.backgroundColor, elements: t.elements },
            }));

        const communityListItems: TemplateListItem[] = FIGMA_COMMUNITY_TEMPLATES.map(t => ({
            id: t.id,
            name: t.name,
            thumbnail: t.thumbnail,
            category: t.category ?? 'Mobile',
            source: 'community' as const,
            author: t.author,
            figmaUrl: t.figmaUrl,
            free: t.free,
        }));

        const all = [...builtins, ...customListItems, ...communityListItems];
        return NextResponse.json({ templates: all, total: all.length });
    } catch (error) {
        console.error('Templates API error:', error);
        return NextResponse.json(
            { error: 'Failed to load templates' },
            { status: 500 }
        );
    }
}

function slugify(name: string): string {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'custom-template'
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const nameRaw = body?.name;
        const bg = body?.backgroundColor;
        const elements = body?.elements as EditorElement[] | undefined;
        const category = (body?.category as string | undefined) ?? 'Custom';

        if (!nameRaw || typeof nameRaw !== 'string') {
            return NextResponse.json({ error: 'Missing name' }, { status: 400 });
        }
        if (!elements || !Array.isArray(elements) || elements.length === 0) {
            return NextResponse.json({ error: 'Missing elements' }, { status: 400 });
        }

        const name = nameRaw.trim();
        const baseId = slugify(name);

        const customTemplates = await readCustomTemplates();

        let id = baseId;
        const exists = (candidate: string) =>
            TEMPLATES_DATA[candidate] !== undefined ||
            TEMPLATES_LIST.some(t => t.id === candidate) ||
            customTemplates.some(t => t.id === candidate);

        if (exists(id)) {
            id = `${baseId}-${Date.now()}`;
        }

        const newTemplate: StoredTemplate = {
            id,
            name,
            backgroundColor: typeof bg === 'string' && bg.trim() ? bg : '#000000',
            elements,
            category,
        };

        const updated = [...customTemplates, newTemplate];
        await writeCustomTemplates(updated);

        const response: { template: TemplateDetail } = {
            template: {
                id: newTemplate.id,
                name: newTemplate.name,
                backgroundColor: newTemplate.backgroundColor,
                elements: newTemplate.elements,
            },
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Templates API POST error:', error);
        return NextResponse.json(
            { error: 'Failed to save template' },
            { status: 500 }
        );
    }
}
