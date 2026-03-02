'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    EditorState,
    EditorActions,
    Screenshot,
    EditorElement,
    TextElement,
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
    zoom: 1,
};

const MAX_HISTORY_SIZE = 50;

// Deep clone function for state
const deepCloneState = (state: EditorState): EditorState => {
    return {
        ...state,
        screenshots: state.screenshots.map(s => ({
            ...s,
            elements: s.elements.map(e => ({ ...e }))
        }))
    };
};

/** Clone template elements with new IDs — minimal work for instant apply */
function cloneElementsWithNewIds(elements: EditorElement[]): EditorElement[] {
    const baseId = `t-${Date.now()}`;
    return elements.map((el, i) => {
        const id = `${baseId}-${i}`;
        const position = { x: el.position.x, y: el.position.y };
        if (el.type === 'image' || el.type === 'shape') {
            return { ...el, id, position, size: { ...el.size } } as EditorElement;
        }
        if (el.type === 'pen') {
            return { ...el, id, position, points: el.points.slice(0) } as EditorElement;
        }
        return { ...el, id, position } as EditorElement;
    });
}

export function useEditorState(): EditorState & EditorActions & { undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean } {
    const [state, setState] = useState<EditorState>(initialState);
    const [canUndo, setCanUndo] = useState<boolean>(false);
    const [canRedo, setCanRedo] = useState<boolean>(false);
    const historyRef = useRef<EditorState[]>([deepCloneState(initialState)]);
    const historyIndexRef = useRef<number>(0);
    const isUndoRedoRef = useRef<boolean>(false);
    const pendingHistoryStateRef = useRef<EditorState | null>(null);

    // Update undo/redo availability
    const updateUndoRedoState = useCallback(() => {
        const history = historyRef.current;
        const currentIndex = historyIndexRef.current;
        setCanUndo(currentIndex > 0);
        setCanRedo(currentIndex < history.length - 1);
    }, []);

    // Save state to history
    const saveToHistory = useCallback((newState: EditorState) => {
        if (isUndoRedoRef.current) {
            isUndoRedoRef.current = false;
            return;
        }

        const history = historyRef.current;
        const currentIndex = historyIndexRef.current;

        // Remove any future history if we're not at the end
        if (currentIndex < history.length - 1) {
            history.splice(currentIndex + 1);
        }

        // Add new state to history
        history.push(deepCloneState(newState));

        // Update history index
        historyIndexRef.current = history.length - 1;
        
        // Limit history size (remove oldest entries)
        if (history.length > MAX_HISTORY_SIZE) {
            const removeCount = history.length - MAX_HISTORY_SIZE;
            history.splice(0, removeCount);
            historyIndexRef.current = history.length - 1;
        }
    }, []);

    // Update state and save to history
    const updateState = useCallback((updater: (prev: EditorState) => EditorState) => {
        setState(prev => {
            const newState = updater(prev);
            saveToHistory(newState);
            // Update undo/redo state after saving to history
            const history = historyRef.current;
            const currentIndex = historyIndexRef.current;
            setCanUndo(currentIndex > 0);
            setCanRedo(currentIndex < history.length - 1);
            return newState;
        });
    }, [saveToHistory]);

    // Undo function
    const undo = useCallback(() => {
        const history = historyRef.current;
        const currentIndex = historyIndexRef.current;

        if (currentIndex > 0) {
            isUndoRedoRef.current = true;
            historyIndexRef.current = currentIndex - 1;
            const previousState = deepCloneState(history[currentIndex - 1]);
            setState(previousState);
            // Update undo/redo state immediately
            const newIndex = historyIndexRef.current;
            setCanUndo(newIndex > 0);
            setCanRedo(newIndex < history.length - 1);
        }
    }, []);

    // Redo function
    const redo = useCallback(() => {
        const history = historyRef.current;
        const currentIndex = historyIndexRef.current;

        if (currentIndex < history.length - 1) {
            isUndoRedoRef.current = true;
            historyIndexRef.current = currentIndex + 1;
            const nextState = deepCloneState(history[currentIndex + 1]);
            setState(nextState);
            // Update undo/redo state immediately
            const newIndex = historyIndexRef.current;
            setCanUndo(newIndex > 0);
            setCanRedo(newIndex < history.length - 1);
        }
    }, []);

    // Update undo/redo state on mount and when needed
    useEffect(() => {
        updateUndoRedoState();
    }, []);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in input/textarea
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                if (canRedo) redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undo, redo]);

    const setProjectName = useCallback((name: string) => {
        updateState(prev => ({ ...prev, projectName: name }));
    }, [updateState]);

    const addScreenshot = useCallback(() => {
        updateState(prev => ({
            ...prev,
            screenshots: [
                ...prev.screenshots,
                createDefaultScreenshot(prev.screenshots.length),
            ],
        }));
    }, [updateState]);

    const removeScreenshot = useCallback((id: string) => {
        updateState(prev => {
            const newScreenshots = prev.screenshots.filter(s => s.id !== id);
            const newActiveIndex = Math.min(prev.activeScreenshotIndex, newScreenshots.length - 1);
            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: Math.max(0, newActiveIndex),
            };
        });
    }, [updateState]);

    const duplicateScreenshot = useCallback((id: string) => {
        updateState(prev => {
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
                backgroundImage: originalScreenshot.backgroundImage,
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
    }, [updateState]);

    const moveScreenshotLeft = useCallback((index: number) => {
        updateState(prev => {
            if (index <= 0 || index >= prev.screenshots.length) return prev;

            const newScreenshots = [...prev.screenshots];
            [newScreenshots[index - 1], newScreenshots[index]] = [newScreenshots[index], newScreenshots[index - 1]];

            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: index - 1,
            };
        });
    }, [updateState]);

    const moveScreenshotRight = useCallback((index: number) => {
        updateState(prev => {
            if (index < 0 || index >= prev.screenshots.length - 1) return prev;

            const newScreenshots = [...prev.screenshots];
            [newScreenshots[index], newScreenshots[index + 1]] = [newScreenshots[index + 1], newScreenshots[index]];

            return {
                ...prev,
                screenshots: newScreenshots,
                activeScreenshotIndex: index + 1,
            };
        });
    }, [updateState]);

    const setActiveScreenshot = useCallback((index: number) => {
        // Don't save to history for selection changes
        setState(prev => ({
            ...prev,
            activeScreenshotIndex: index,
            selectedElementId: null,
        }));
    }, []);

    const updateScreenshotBackground = useCallback((id: string, color: string) => {
        updateState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === id ? { ...s, backgroundColor: color } : s
            ),
        }));
    }, [updateState]);

    const updateScreenshotBackgroundImage = useCallback((id: string, imageUrl: string | null) => {
        updateState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === id 
                    ? { ...s, backgroundImage: imageUrl || undefined } 
                    : s
            ),
        }));
    }, [updateState]);

    const addElement = useCallback((screenshotId: string, element: EditorElement) => {
        updateState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === screenshotId
                    ? { ...s, elements: [...s.elements, element] }
                    : s
            ),
            selectedElementId: element.id,
        }));
    }, [updateState]);

    const updateElement = useCallback((
        screenshotId: string,
        elementId: string,
        updates: Partial<EditorElement>
    ) => {
        updateState(prev => ({
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
    }, [updateState]);

    const removeElement = useCallback((screenshotId: string, elementId: string) => {
        updateState(prev => ({
            ...prev,
            screenshots: prev.screenshots.map(s =>
                s.id === screenshotId
                    ? { ...s, elements: s.elements.filter(e => e.id !== elementId) }
                    : s
            ),
            selectedElementId: prev.selectedElementId === elementId ? null : prev.selectedElementId,
        }));
    }, [updateState]);

    const replaceElementWithText = useCallback((screenshotId: string, elementId: string) => {
        updateState(prev => {
            const screenshot = prev.screenshots.find(s => s.id === screenshotId);
            if (!screenshot) return prev;
            const el = screenshot.elements.find(e => e.id === elementId);
            if (!el || (el.type !== 'shape' && el.type !== 'image')) return prev;
            const width = el.type === 'shape' ? el.size.width : el.size.width;
            const position = { ...el.position };
            const newText: TextElement = {
                id: uuidv4(),
                type: 'text',
                content: '',
                position,
                rotation: 0,
                opacity: 1,
                locked: false,
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontStyle: 'normal',
                fill: '#000000',
                align: 'left',
                width,
            };
            return {
                ...prev,
                screenshots: prev.screenshots.map(s =>
                    s.id !== screenshotId
                        ? s
                        : {
                            ...s,
                            elements: s.elements.map(e => e.id === elementId ? newText : e),
                        }
                ),
                selectedElementId: newText.id,
            };
        });
    }, [updateState]);

    const selectElement = useCallback((elementId: string | null) => {
        // Don't save to history for selection changes
        setState(prev => ({ ...prev, selectedElementId: elementId }));
    }, []);

    const zoomIn = useCallback(() => {
        // Don't save to history for zoom changes
        setState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 3) }));
    }, []);

    const zoomOut = useCallback(() => {
        // Don't save to history for zoom changes
        setState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
    }, []);

    const resetZoom = useCallback(() => {
        // Don't save to history for zoom changes
        setState(prev => ({ ...prev, zoom: 1 }));
    }, []);

    const setZoom = useCallback((zoom: number) => {
        // Don't save to history for zoom changes
        setState(prev => ({ ...prev, zoom: Math.max(0.5, Math.min(zoom, 3)) }));
    }, []);

    const applyTemplate = useCallback((template: { backgroundColor: string; elements: EditorElement[] }) => {
        let newState: EditorState;
        setState(prev => {
            const newScreenshots = prev.screenshots.map((screenshot, index) => {
                if (index !== prev.activeScreenshotIndex) {
                    return screenshot;
                }

                const clonedElements = cloneElementsWithNewIds(template.elements);
                return {
                    ...screenshot,
                    backgroundColor: template.backgroundColor,
                    backgroundImage: undefined,
                    elements: clonedElements,
                };
            });

            newState = {
                ...prev,
                screenshots: newScreenshots,
                selectedElementId: null,
            };
            pendingHistoryStateRef.current = newState;
            return newState;
        });
        setTimeout(() => {
            if (pendingHistoryStateRef.current) {
                saveToHistory(pendingHistoryStateRef.current);
                pendingHistoryStateRef.current = null;
                updateUndoRedoState();
            }
        }, 0);
    }, [saveToHistory, updateUndoRedoState]);

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
        updateScreenshotBackgroundImage,
        addElement,
        updateElement,
        removeElement,
        replaceElementWithText,
        selectElement,
        zoomIn,
        zoomOut,
        resetZoom,
        setZoom,
        applyTemplate,
        undo,
        redo,
        canUndo,
        canRedo,
    };
}
