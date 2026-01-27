'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    EditorState,
    EditorActions,
    Screenshot,
    EditorElement,
    PRESET_COLORS
} from '@/types/editor';

const createDefaultScreenshot = (index: number): Screenshot => ({
    id: uuidv4(),
    name: `Screenshot ${index + 1}`,
    backgroundColor: PRESET_COLORS[0],
    elements: [],
});

const initialState: EditorState = {
    projectName: 'My App Screenshots',
    screenshots: [
        createDefaultScreenshot(0),
        createDefaultScreenshot(1),
        createDefaultScreenshot(2),
    ],
    activeScreenshotIndex: 0,
    selectedElementId: null,
};

export function useEditorState(): EditorState & EditorActions {
    const [state, setState] = useState<EditorState>(initialState);

    const setProjectName = useCallback((name: string) => {
        setState(prev => ({ ...prev, projectName: name }));
    }, []);

    const addScreenshot = useCallback(() => {
        setState(prev => ({
            ...prev,
            screenshots: [
                ...prev.screenshots,
                createDefaultScreenshot(prev.screenshots.length),
            ],
        }));
    }, []);

    const removeScreenshot = useCallback((id: string) => {
        setState(prev => {
            const newScreenshots = prev.screenshots.filter(s => s.id !== id);
            const newActiveIndex = Math.min(prev.activeScreenshotIndex, newScreenshots.length - 1);
            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: Math.max(0, newActiveIndex),
            };
        });
    }, []);

    const duplicateScreenshot = useCallback((id: string) => {
        setState(prev => {
            const screenshotIndex = prev.screenshots.findIndex(s => s.id === id);
            if (screenshotIndex === -1) return prev;

            const originalScreenshot = prev.screenshots[screenshotIndex];
            
            // Deep clone elements with new IDs
            const duplicatedElements = originalScreenshot.elements.map(element => ({
                ...element,
                id: uuidv4(),
            }));

            const duplicatedScreenshot: Screenshot = {
                id: uuidv4(),
                name: `${originalScreenshot.name} (Copy)`,
                backgroundColor: originalScreenshot.backgroundColor,
                elements: duplicatedElements,
            };

            const newScreenshots = [
                ...prev.screenshots.slice(0, screenshotIndex + 1),
                duplicatedScreenshot,
                ...prev.screenshots.slice(screenshotIndex + 1),
            ];

            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: screenshotIndex + 1,
            };
        });
    }, []);

    const moveScreenshotLeft = useCallback((index: number) => {
        setState(prev => {
            if (index <= 0 || index >= prev.screenshots.length) return prev;

            const newScreenshots = [...prev.screenshots];
            [newScreenshots[index - 1], newScreenshots[index]] = [newScreenshots[index], newScreenshots[index - 1]];

            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: index - 1,
            };
        });
    }, []);

    const moveScreenshotRight = useCallback((index: number) => {
        setState(prev => {
            if (index < 0 || index >= prev.screenshots.length - 1) return prev;

            const newScreenshots = [...prev.screenshots];
            [newScreenshots[index], newScreenshots[index + 1]] = [newScreenshots[index + 1], newScreenshots[index]];

            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: index + 1,
            };
        });
    }, []);

    const setActiveScreenshot = useCallback((index: number) => {
        setState(prev => ({
            ...prev,
            activeScreenshotIndex: index,
            selectedElementId: null,
        }));
    }, []);

    const updateScreenshotBackground = useCallback((id: string, color: string) => {
        setState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === id ? { ...s, backgroundColor: color } : s
            ),
        }));
    }, []);

    const addElement = useCallback((screenshotId: string, element: EditorElement) => {
        setState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === screenshotId
                    ? { ...s, elements: [...s.elements, element] }
                    : s
            ),
            selectedElementId: element.id,
        }));
    }, []);

    const updateElement = useCallback((
        screenshotId: string,
        elementId: string,
        updates: Partial<EditorElement>
    ) => {
        setState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === screenshotId
                    ? {
                        ...s,
                        elements: s.elements.map(e =>
                            e.id === elementId ? { ...e, ...updates } as EditorElement : e
                        ),
                    }
                    : s
            ),
        }));
    }, []);

    const removeElement = useCallback((screenshotId: string, elementId: string) => {
        setState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === screenshotId
                    ? { ...s, elements: s.elements.filter(e => e.id !== elementId) }
                    : s
            ),
            selectedElementId: prev.selectedElementId === elementId ? null : prev.selectedElementId,
        }));
    }, []);

    const selectElement = useCallback((elementId: string | null) => {
        setState(prev => ({ ...prev, selectedElementId: elementId }));
    }, []);

    return {
        ...state,
        setProjectName,
        addScreenshot,
        removeScreenshot,
        duplicateScreenshot,
        moveScreenshotLeft,
        moveScreenshotRight,
        setActiveScreenshot,
        updateScreenshotBackground,
        addElement,
        updateElement,
        removeElement,
        selectElement,
    };
}
