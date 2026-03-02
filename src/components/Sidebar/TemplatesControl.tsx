'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { getTemplates, invalidateTemplatesCache } from '@/utils/templatesCache';
import { FIGMA_COMMUNITY_TEMPLATES } from '@/data/figmaCommunityTemplates';

interface TemplatePayload {
    backgroundColor: string;
    elements: import('@/types/editor').EditorElement[];
}

type TemplateItem = {
    id: string;
    name: string;
    thumbnail: string | null;
    category?: string;
    source?: 'builtin' | 'custom' | 'community';
    author?: string;
    figmaUrl?: string;
    free?: boolean;
    payload?: TemplatePayload;
};

/** Instant list — no wait for API; community templates from static data */
const INSTANT_TEMPLATES: TemplateItem[] = FIGMA_COMMUNITY_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    thumbnail: t.thumbnail,
    category: t.category ?? 'Mobile',
    source: 'community' as const,
    author: t.author,
    figmaUrl: t.figmaUrl,
    free: t.free,
}));

interface TemplatesControlProps {
    onApplyTemplate: (template: TemplatePayload) => void;
}

export default function TemplatesControl({ onApplyTemplate }: TemplatesControlProps) {
    const [templates, setTemplates] = useState<TemplateItem[]>(INSTANT_TEMPLATES);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplates = (forceRefetch = false) => {
        setError(null);
        if (forceRefetch) invalidateTemplatesCache();
        getTemplates()
            .then((data) => {
                if (data?.templates?.length) setTemplates(data.templates as TemplateItem[]);
            })
            .catch(() => setError('Failed to load templates'));
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleTemplateClick = (template: TemplateItem) => {
        if (template.source === 'community' && template.figmaUrl) {
            window.open(template.figmaUrl, '_blank', 'noopener,noreferrer');
            return;
        }
        if (template.payload) {
            onApplyTemplate(template.payload);
            return;
        }
        fetch(`/api/templates?id=${template.id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch template');
                return res.json();
            })
            .then((json) => {
                if (!json.template?.backgroundColor || !json.template?.elements) throw new Error('Invalid template data');
                onApplyTemplate({
                    backgroundColor: json.template.backgroundColor,
                    elements: json.template.elements,
                });
            })
            .catch((err) => {
                console.error('Error applying template:', err);
                alert('Failed to apply template');
            });
    };

    if (error) {
        return (
            <div className="control-section">
                <div className="text-center py-8">
                    <p className="text-sm text-red-400 mb-3">{error}</p>
                    <button
                        onClick={() => fetchTemplates(true)}
                        className="text-sm text-purple-400 hover:text-purple-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="control-section">
                <div className="text-center py-8">
                    <Sparkles size={32} className="mx-auto mb-3 text-gray-600" />
                    <p className="text-sm text-gray-400">No templates found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="control-section templates-section">
            <p className="templates-section-hint">Select a template to apply to your screens. All text is editable.</p>
            <div className="templates-grid-wrap">
                <div className="templates-grid">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            type="button"
                            className={`template-card ${template.source === 'community' ? 'template-card--community' : ''}`}
                            onClick={() => handleTemplateClick(template)}
                            disabled={template.source === 'community' ? false : !template.payload}
                        >
                            <div className="template-preview">
                                {template.thumbnail ? (
                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="template-placeholder">
                                        <span className="template-placeholder-text">{template.name}</span>
                                    </div>
                                )}
                                {template.source === 'community' && (
                                    <span className="template-card-badge template-card-badge--figma">Figma</span>
                                )}
                            </div>
                            <div className="template-info">
                                <span className="template-name">{template.name}</span>
                                {template.source === 'community' ? (
                                    <>
                                        {template.author && <span className="template-author">by {template.author}</span>}
                                        <span className="template-apply-label template-apply-label--open">
                                            <ExternalLink size={12} /> Open in Figma
                                        </span>
                                    </>
                                ) : (
                                    <span className="template-apply-label">Apply</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
