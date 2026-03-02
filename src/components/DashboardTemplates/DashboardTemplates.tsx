'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { getTemplates, invalidateTemplatesCache } from '@/utils/templatesCache';
import { FIGMA_COMMUNITY_TEMPLATES } from '@/data/figmaCommunityTemplates';
import type { EditorElement } from '@/types/editor';


interface TemplatePayload {
  backgroundColor?: string;
  elements: EditorElement[];
}

type TemplateItem = {
  id: string;
  name: string;
  thumbnail: string | null;
  category?: string;
  source?: 'builtin' | 'custom' | 'community';
  author?: string;
  free?: boolean;
  payload?: TemplatePayload;
};

interface DashboardTemplatesProps {
  onApplyTemplate: (template: TemplatePayload) => void;
}

/* ============================================================
   Canvas Config



   Helpers
============================================================ */

function normalizeTemplate(t: any): TemplateItem | null {
  if (!t?.id || !t?.name) return null;

  return {
    id: String(t.id),
    name: String(t.name),
    thumbnail: t.thumbnail ?? null,
    category: t.category,
    source: t.source ?? 'builtin',
    author: t.author,
    free: t.free,
    payload: t.payload,
  };
}

function extractTemplatePayload(json: any): TemplatePayload | null {
  const data = json?.template ?? json?.data ?? json;
  if (!data) return null;

  return {
    backgroundColor:
      data.backgroundColor ??
      data.background_color ??
      '#000000',
    elements: Array.isArray(data.elements) ? data.elements : [],
  };
}

/* ============================================================
   Component
============================================================ */

export default function DashboardTemplates({
  onApplyTemplate,
}: DashboardTemplatesProps) {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  /* ================= Load Templates ================= */

  const loadTemplates = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      if (force) invalidateTemplatesCache();

      const apiData = await getTemplates();

      const communityTemplates: TemplateItem[] =
        FIGMA_COMMUNITY_TEMPLATES.map((t) => ({
          id: t.id,
          name: t.name,
          thumbnail: t.thumbnail,
          category: t.category,
          source: 'community',
        }));

      const apiTemplates =
        apiData?.templates
          ?.map(normalizeTemplate)
          .filter(Boolean) ?? [];

      const merged = [
        ...communityTemplates,
        ...(apiTemplates as TemplateItem[]),
      ];

      const uniqueTemplates = Array.from(
        new Map(merged.map((t) => [t.id, t])).values()
      );

      setTemplates(uniqueTemplates);
    } catch (err) {
      console.error('Template load failed:', err);
      setError('Templates load nahi ho paye');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  /* ================= Apply Template ================= */

  const applyTemplate = async (template: TemplateItem) => {
    try {
      setApplyingId(template.id);

      /* ---------- COMMUNITY IMAGE TEMPLATE ---------- */

      if (template.source === 'community' && template.thumbnail) {
        const img = new Image();
        img.src = template.thumbnail;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const imgRatio = img.width / img.height;
        const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

        let finalWidth = CANVAS_WIDTH;
        let finalHeight = CANVAS_HEIGHT;

        if (imgRatio > canvasRatio) {
          finalWidth = CANVAS_WIDTH;
          finalHeight = CANVAS_WIDTH / imgRatio;
        } else {
          finalHeight = CANVAS_HEIGHT;
          finalWidth = CANVAS_HEIGHT * imgRatio;
        }

        const imageTemplate: TemplatePayload = {
          backgroundColor: '#000000',
          elements: [
            {
              id: crypto.randomUUID(),
              type: 'image',
              src: template.thumbnail,
              position: {
                x: (CANVAS_WIDTH - finalWidth) / 2,
                y: (CANVAS_HEIGHT - finalHeight) / 2,
              },
              size: {
                width: finalWidth,
                height: finalHeight,
              },
              rotation: 0,
              opacity: 1,
              locked: false,
            } as EditorElement,
          ],
        };

        onApplyTemplate(imageTemplate);
        return;
      }

      /* ---------- BUILTIN PAYLOAD TEMPLATE ---------- */

      if (template.payload) {
        onApplyTemplate(template.payload);
        return;
      }

      /* ---------- FETCH TEMPLATE FROM API ---------- */

      const res = await fetch(`/api/templates?id=${template.id}`);
      if (!res.ok) throw new Error('Fetch failed');

      const json = await res.json();
      const payload = extractTemplatePayload(json);
      if (!payload) return;

      onApplyTemplate(payload);
    } catch (err) {
      console.error('Template apply error:', err);
    } finally {
      setApplyingId(null);
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="dashboard-templates dashboard-templates--loading">
        Loading templates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-templates dashboard-templates--error">
        <span>{error}</span>
        <button
          type="button"
          onClick={() => loadTemplates(true)}
          className="dashboard-templates-retry"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="dashboard-templates dashboard-templates--empty">
        <Sparkles size={20} />
        <span>Abhi koi template nahi</span>
      </div>
    );
  }

  /* ================= MAIN RENDER ================= */

  return (
    <div className="dashboard-templates">
      <div className="dashboard-templates-label">
        Start with template
      </div>

      <div className="dashboard-templates-strip">
        {templates.map((template) => {
          const isApplying = applyingId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              className={`dashboard-templates-card ${
                template.source === 'community'
                  ? 'dashboard-templates-card--community'
                  : ''
              }`}
              onClick={() => applyTemplate(template)}
              disabled={isApplying}
            >
              <div className="dashboard-templates-card-preview">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    draggable={false}
                  />
                ) : (
                  <div className="dashboard-templates-card-placeholder">
                    <Sparkles size={28} />
                  </div>
                )}
              </div>

              <span className="dashboard-templates-card-name">
                {template.name}
              </span>

              <span className="dashboard-templates-card-action">
                {isApplying ? 'Applying...' : 'Use'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}